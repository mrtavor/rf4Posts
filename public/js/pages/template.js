import { mapsData } from '../maps/mapsData.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, limit, query, where, orderBy, startAfter } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from '../utils/firebase-config.js';
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { syncDotsLayerSize, drawCircleOnMap, addCirclePoint, redrawAllPoints, extractCoordinates } from '../maps/mapCoords.js';
import { enablePostHoverHighlight } from '../utils/postHoverHandler.js';
import { startVersionChecker } from '../version-management/versionChecker.js';
import { setupCoordsInput } from '../maps/coords-input.js';
import mapManager from '../maps/mapDataManager.js';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

let allPoints = [];

window.addEventListener('DOMContentLoaded', async function() {
    // Инициализируем менеджер данных карт
    await mapManager.initialize();
    
    // Получаем ключ карты из URL
    const mapKey = mapManager.getMapKeyFromUrl();
    
    // Получаем полные данные карты
    const mapData = mapManager.getMapData(mapKey);
    
    // Получаем элементы DOM
    const titleElement = document.getElementById('title');
    const imageElement = document.getElementById('image');
    const postsContainer = document.getElementById('posts-container');

    // Устанавливаем название и картинку
    if (mapData) {
        titleElement.textContent = mapData.title;
        imageElement.src = mapData.image;
        document.title = mapData.title + ' | Точки лова';
    } else if (mapsData[mapKey]) {
        // Запасной вариант, если mapManager не нашел данные
        titleElement.textContent = mapsData[mapKey].name;
        imageElement.src = mapsData[mapKey].image;
        document.title = mapsData[mapKey].name + ' | Точки лова';
    } else {
        titleElement.textContent = 'Название не найдено';
        imageElement.src = 'images/default-image.webp';
        document.title = 'Точки лова';
    }

    // Синхронизируем размер слоя точек с размером изображения
    syncDotsLayerSize('image');

    let lastDoc = null;
    let loading = false;
    let allPostsLoaded = false;

    async function loadPostsChunk() {
        if (loading || allPostsLoaded) return;
        loading = true;
        
        // Получаем ключ карты для запроса к Firestore
        const firestoreMapKey = mapData ? mapData.mapKey : (mapsData[mapKey]?.map || mapKey);
        
        const { posts, lastDoc: newLastDoc } = await fetchPostsFromFirestore(firestoreMapKey, lastDoc, 20);

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
                const mapName = mapData ? mapData.title : mapsData[mapKey]?.name;
                drawCircleOnMap('image', coords, mapManager.mapJsonData, mapName);
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

    // Показываем первые 20 постов
    await loadPostsChunk();

    // Подгружаем еще при скролле (infinite scroll)
    window.addEventListener('scroll', async () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
            await loadPostsChunk();
        }
    });

    const mapName = mapData ? mapData.title : mapsData[mapKey]?.name;

    imageElement.onload = () => {
        syncDotsLayerSize('image');
        redrawAllPoints('image', mapManager.mapJsonData, allPoints, mapName);
    };

    window.addEventListener('resize', () => {
        syncDotsLayerSize('image');
        redrawAllPoints('image', mapManager.mapJsonData, allPoints, mapName);
    });

    const tooltip = document.getElementById('mouse-coords-tooltip');

    imageElement.addEventListener('mousemove', (event) => {
        // Используем метод pixelsToGameCoords из менеджера карт
        const coords = mapManager.pixelsToGameCoords(event);
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
        versionUrl: '/data/config/version.json',
        checkInterval: 5 * 60 * 1000 // 5 минут
    });

    // Передаем все необходимые данные в setupCoordsInput
    setupCoordsInput({ 
        mapsData, 
        mapData: mapManager.mapJsonData, 
        title: mapKey 
    });
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

// Функция для возврата на главную страницу
function goHome() {
    window.location.href = '/home';
}