import { mapsData } from './mapsData.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, limit, query, where, orderBy, startAfter } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { loadMapData, syncDotsLayerSize, drawCircleOnMap, addCirclePoint, redrawAllPoints, extractCoordinates, getMouseGameCoords } from './mapCoords.js';
import { enablePostHoverHighlight } from './postHoverHandler.js';
import { startVersionChecker } from './versionChecker.js';
import { setupCoordsInput } from './coords-input.js';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

let mapData = [];
let allPoints = [];

window.addEventListener('DOMContentLoaded', async function() {
    // Получить параметр из URL
    function getParameterByName(name) {
        const url = new URL(window.location.href);
        return url.searchParams.get(name);
    }

    // Получить title из URL
    const title = getParameterByName('title');

    // Получить элементы DOM
    const titleElement = document.getElementById('title');
    const imageElement = document.getElementById('image');
    const postsContainer = document.getElementById('posts-container');

    // Установить название и картинку
    if (mapsData[title]) {
        titleElement.textContent = mapsData[title].name;
        imageElement.src = mapsData[title].image;
    } else {
        titleElement.textContent = 'Название не найдено';
        imageElement.src = 'images/default-image.webp';
    }

    // Припустимо, mapsData[title].name — це назва карти
    if (mapsData[title] && mapsData[title].name) {
        document.title = mapsData[title].name + ' | Точки лова';
    } else {
        document.title = 'Точки лова';
    }

    // Загружаем данные карты
    mapData = await loadMapData();

    // Синхронизируем слой точек с размером картинки
    syncDotsLayerSize('image');

    let lastDoc = null;
    let loading = false;
    let allPostsLoaded = false;

    async function loadPostsChunk() {
        if (loading || allPostsLoaded) return;
        loading = true;
        const mapKey = mapsData[title]?.map || title;
        const { posts, lastDoc: newLastDoc } = await fetchPostsFromFirestore(mapKey, lastDoc, 20);

        // Если ничего не пришло — больше постов нет
        if (posts.length === 0) {
            allPostsLoaded = true;
            loading = false;
            return;
        }

        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            let descriptionHTML = '';
            if (post.description && post.description.length > 120) {
                const shortText = post.description.slice(0, 120) + '...';
                descriptionHTML = `<span><b>Описание:</b> <span class="desc-short">${shortText}</span><span class="desc-full collapsed">${post.description}</span><a href="#" class="read-more">читать далее</a><a href="#" class="hide-desc" style="display:none;">скрыть</a></span>`;
            } else {
                descriptionHTML = `<span><b>Описание:</b> ${post.description || ''}</span>`;
            }

            postDiv.innerHTML = `
                <div class="post-header">
                    <span class="post-date">${post.date}</span>
                    <a class="post-link" href="${post.post_URL}" target="_blank">VK</a>
                </div>
                <div class="post-body">
                    <div><b>Рыба:</b> ${post.fish}</div>
                    <div><b>Координаты:</b> ${post.coordinates}</div>
                    <div><b>Клипса:</b> ${post.clip}</div>
                    ${post.temperature ? `<div><b>Температура:</b> ${post.temperature}</div>` : ''}
                    ${descriptionHTML}
                </div>
            `;
            postsContainer.appendChild(postDiv);

            // Добавляем точку, если есть координаты
            const coords = extractCoordinates(post.coordinates);
            if (coords) {
                addCirclePoint(allPoints, coords);
                const mapName = mapsData[title]?.name;
                drawCircleOnMap('image', coords, mapData, mapName);
            }

            // Добавляем обработчики для "читать далее" и "скрыть"
            const readMore = postDiv.querySelector('.read-more');
            const hideDesc = postDiv.querySelector('.hide-desc');
            const descShort = postDiv.querySelector('.desc-short');
            const descFull = postDiv.querySelector('.desc-full');

            if (readMore && hideDesc && descShort && descFull) {
                // Начальное состояние
                descFull.classList.add('collapsed');
                descFull.classList.remove('expanded');
                descFull.style.display = 'block'; // Чтобы transition работал

                readMore.addEventListener('click', function(e) {
                    e.preventDefault();
                    readMore.style.display = 'none';
                    descShort.style.display = 'none';
                    descFull.classList.remove('collapsed');
                    descFull.classList.add('expanded');
                    hideDesc.style.display = 'inline';
                });
                hideDesc.addEventListener('click', function(e) {
                    e.preventDefault();
                    readMore.style.display = 'inline';
                    descShort.style.display = 'inline';
                    descFull.classList.remove('expanded');
                    descFull.classList.add('collapsed');
                    hideDesc.style.display = 'none';
                });
            }
        });
        lastDoc = newLastDoc;

        // Если получили меньше, чем batchSize — это был последний пакет
        if (posts.length < 20) {
            allPostsLoaded = true;
        }
        loading = false;

        enablePostHoverHighlight(postsContainer);
    }

    // Показать первые 20 постов
    await loadPostsChunk();

    // Подгружать еще при скролле (infinite scroll)
    window.addEventListener('scroll', async () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
            await loadPostsChunk();
        }
    });

    const mapName = mapsData[title]?.name;

    imageElement.onload = () => {
        syncDotsLayerSize('image');
        redrawAllPoints('image', mapData, allPoints, mapName);
    };

    window.addEventListener('resize', () => {
        syncDotsLayerSize('image');
        redrawAllPoints('image', mapData, allPoints, mapName);
    });

    const tooltip = document.getElementById('mouse-coords-tooltip');

    imageElement.addEventListener('mousemove', (event) => {
        const coords = getMouseGameCoords(event, 'image', mapData, mapName);
        if (coords) {
            // Округляем до целых
            const x = Math.round(coords.x);
            const y = Math.round(coords.y);
            tooltip.textContent = `${x}:${y}`;
            tooltip.style.display = 'block';
            tooltip.style.left = (event.clientX + 16) + 'px';
            tooltip.style.top = (event.clientY + 16) + 'px';
        }
    });

    imageElement.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });

    startVersionChecker({
        versionUrl: '/data/version.json',
        checkInterval: 5 * 60 * 1000 // 5 минут
    });

    setupCoordsInput({ mapsData, mapData, title });
});

async function fetchPostsFromFirestore(map, lastDoc = null, batchSize = 20) {
    let q = query(
        collection(db, "posts"),
        where("map", "==", map),
        orderBy("timestamp", "desc"),
        limit(batchSize)
    );
    if (lastDoc) {
        q = query(q, startAfter(lastDoc));
    }
    const snapshot = await getDocs(q);
    const posts = [];
    snapshot.forEach(doc => posts.push(doc.data()));
    return { posts, lastDoc: snapshot.docs[snapshot.docs.length - 1] };
}