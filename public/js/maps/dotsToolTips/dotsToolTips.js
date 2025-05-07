import { fishDatabase } from '../../../data/fish-database.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, initializeFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, firestoreSettings } from '../../utils/firebase-config.js';

// Ініціалізуємо Firebase з обробкою помилок
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = initializeFirestore(app, firestoreSettings);
} catch (error) {
    console.error('Помилка ініціалізації Firebase:', error);
}

// Список слів, які не потрібно враховувати при порівнянні
const ignoreWords = ['і', 'та', 'з', 'на', 'в', 'у', 'до', 'для', 'про', 'за', 'через', 'над', 'під', 'біля', 'коло', 'при', 'по', 'від', 'до', 'через', 'над', 'під', 'біля', 'коло', 'при', 'по', 'від'];

// Змінні для відстеження стану підказок
let allPosts = [];
let currentMapName = '';
let tooltipContainer = null;
let isTooltipsInitialized = false;

// Функція для порівняння назв риб
function compareFishNames(fishName1, fishName2) {
    // Приводимо до нижнього регістру та розбиваємо на слова
    const words1 = fishName1.toLowerCase().split(/\s+/).filter(word => !ignoreWords.includes(word));
    const words2 = fishName2.toLowerCase().split(/\s+/).filter(word => !ignoreWords.includes(word));
    
    // Рахуємо кількість співпадінь
    let matches = 0;
    for (const word1 of words1) {
        for (const word2 of words2) {
            if (word1 === word2) {
                matches++;
            }
        }
    }
    
    // Рахуємо відсоток співпадіння
    const totalWords = Math.max(words1.length, words2.length);
    return (matches / totalWords) * 100;
}

// Функція для знаходження найкращого співпадіння в базі даних
function findBestMatch(fishName) {
    let bestMatch = null;
    let bestScore = 0;
    
    for (const fish of fishDatabase) {
        const score = compareFishNames(fishName, fish.name);
        if (score > bestScore && score >= 80) {
            bestScore = score;
            bestMatch = fish;
        }
    }
    
    return bestMatch;
}

// Функція для перевірки стану рулетки
function isRulerActive() {
    const rulerCheckbox = document.querySelector('#ruler-switch-checkbox');
    return rulerCheckbox && rulerCheckbox.checked;
}

// Функція для створення підказки
function createTooltip(posts) {
    const tooltip = document.createElement('div');
    tooltip.className = 'dot-tooltip';
    
    // Створюємо контейнер для контенту
    const contentContainer = document.createElement('div');
    contentContainer.className = 'tooltip-content';
    
    // Створюємо контейнер для навігації
    const navigationContainer = document.createElement('div');
    navigationContainer.className = 'tooltip-navigation';
    
    let currentPostIndex = 0;
    
    function updateContent() {
        const post = posts[currentPostIndex];
        const bestMatch = findBestMatch(post.fish);
        const displayName = bestMatch ? bestMatch.name : post.fish;
        
        // Отримуємо координати з посту
        const coords = post.coordinates.match(/(\d{1,3})[:,\s](\d{1,3})/);
        const coordinates = coords ? `${coords[1]}:${coords[2]}` : '';
        
        contentContainer.innerHTML = `
            <div class="dot-tooltip-title">${displayName}</div>
            <div class="dot-tooltip-coordinates">${coordinates}</div>
            <div class="dot-tooltip-description">${post.description || ''}</div>
            <a href="#" class="dot-tooltip-link" data-post-url="${post.post_URL}">Перейти до посту</a>
        `;
        
        // Додаємо обробник для посилання
        const link = contentContainer.querySelector('.dot-tooltip-link');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const postElement = document.querySelector(`.post[data-post-url="${post.post_URL}"]`);
            if (postElement) {
                postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                postElement.classList.add('highlight');
                setTimeout(() => postElement.classList.remove('highlight'), 2000);
            }
        });
    }
    
    // Додаємо кнопки навігації, якщо є більше одного посту
    if (posts.length > 1) {
        navigationContainer.style.display = 'flex';
        navigationContainer.innerHTML = `
            <button class="tooltip-nav-btn prev" ${currentPostIndex === 0 ? 'disabled' : ''}>←</button>
            <span class="tooltip-counter">${currentPostIndex + 1}/${posts.length}</span>
            <button class="tooltip-nav-btn next" ${currentPostIndex === posts.length - 1 ? 'disabled' : ''}>→</button>
        `;
        
        // Додаємо обробники подій для кнопок
        const prevBtn = navigationContainer.querySelector('.prev');
        const nextBtn = navigationContainer.querySelector('.next');
        const counter = navigationContainer.querySelector('.tooltip-counter');
        
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentPostIndex > 0) {
                currentPostIndex--;
                updateContent();
                prevBtn.disabled = currentPostIndex === 0;
                nextBtn.disabled = false;
                counter.textContent = `${currentPostIndex + 1}/${posts.length}`;
            }
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentPostIndex < posts.length - 1) {
                currentPostIndex++;
                updateContent();
                nextBtn.disabled = currentPostIndex === posts.length - 1;
                prevBtn.disabled = false;
                counter.textContent = `${currentPostIndex + 1}/${posts.length}`;
            }
        });
    } else {
        navigationContainer.style.display = 'none';
    }
    
    tooltip.appendChild(contentContainer);
    tooltip.appendChild(navigationContainer);
    
    // Ініціалізуємо контент
    updateContent();
    
    return tooltip;
}

// Функція для отримання постів для карти
async function getPostsForMap(mapName) {
    if (!db) {
        console.error('Firestore не ініціалізовано');
        return [];
    }

    try {
        const postsCollection = collection(db, "posts");
        const q = query(
            postsCollection,
            where("map", "==", mapName)
        );
        
        const querySnapshot = await getDocs(q);
        const posts = [];
        
        querySnapshot.forEach((doc) => {
            posts.push(doc.data());
        });
        
        return posts;
    } catch (error) {
        console.error('Помилка отримання постів:', error);
        return [];
    }
}

// Функція для прив'язки підказок до точок
function bindTooltipsToDots() {
    // Перевіряємо чи ініціалізовані підказки
    if (!isTooltipsInitialized || !tooltipContainer) {
        console.error('Підказки не ініціалізовані');
        return;
    }
    
    // Отримуємо видимі пости (ті, що не приховані фільтрацією)
    const visiblePosts = Array.from(document.querySelectorAll('.post'))
        .filter(post => post.style.display !== 'none')
        .map(post => {
            const postUrl = post.getAttribute('data-post-url');
            return allPosts.find(p => p.post_URL === postUrl);
        })
        .filter(Boolean); // Видаляємо undefined елементи
    
    console.log('Видимі пости після фільтрації:', visiblePosts.length);
    
    // Очищаємо контейнер підказок
    tooltipContainer.innerHTML = '';
    
    // Отримуємо всі точки на карті
    const dots = document.querySelectorAll('.map-dot');
    if (dots.length === 0) {
        console.log('Точки на карті не знайдені');
        return;
    }
    
    console.log('Привʼязка підказок до точок:', dots.length);
    
    // Оновлюємо стан точок на карті
        const isActive = isRulerActive();
        dots.forEach(dot => {
            if (isActive) {
                dot.style.pointerEvents = 'none';
                dot.style.cursor = 'default';
            } else {
                dot.style.pointerEvents = 'auto';
                dot.style.cursor = 'pointer';
            }
        
        const x = dot.getAttribute('data-coord-x');
        const y = dot.getAttribute('data-coord-y');
        
        // Знаходимо всі пости з відповідними координатами серед видимих
        const dotPosts = visiblePosts.filter(p => {
            if (!p || !p.coordinates) return false;
            const coords = p.coordinates.match(/(\d{1,3})[:,\s](\d{1,3})/);
            return coords && coords[1] === x && coords[2] === y;
        });
        
        if (dotPosts.length > 0) {
            const tooltip = createTooltip(dotPosts);
            tooltipContainer.appendChild(tooltip);
            
            let isHoveringDot = false;
            let isHoveringTooltip = false;
            
            function updateTooltipVisibility() {
                if ((isHoveringDot || isHoveringTooltip) && !isRulerActive()) {
                    tooltip.classList.add('visible');
                } else {
                    tooltip.classList.remove('visible');
                }
            }
            
            // Показуємо підказку при наведенні на точку
            dot.addEventListener('mouseenter', () => {
                if (isRulerActive()) return;
                
                console.log('Наведення на точку:', x, y);
                isHoveringDot = true;
                
                // Отримуємо розміри та позицію точки
                const dotRect = dot.getBoundingClientRect();
                const dotLeft = parseFloat(dot.style.left);
                const dotTop = parseFloat(dot.style.top);
                
                // Отримуємо розміри контейнера карти
                const imageWrapper = document.getElementById('image-wrapper');
                const wrapperRect = imageWrapper ? imageWrapper.getBoundingClientRect() : null;
                
                // Визначаємо позицію підказки
                let tooltipLeft, tooltipTop;
                
                // Використовуємо позицію точки з DOM
                tooltipLeft = dotRect.left + (dotRect.width / 2);
                // Позиція вище від точки на 15 пікселів
                tooltipTop = dotRect.top - 15; 
                
                // Позиціонуємо підказку відразу в правильному місці
                tooltip.style.left = `${tooltipLeft}px`;
                tooltip.style.top = `${tooltipTop}px`;
                tooltip.style.transform = 'translate(-50%, -100%)';
                tooltip.classList.remove('tooltip-bottom');
                
                // Перевіряємо, чи підказка не виходить за межі екрану
                const tooltipRect = tooltip.getBoundingClientRect();
                
                // Перевірка верхнього краю
                if (tooltipRect.top < 20) {
                    // Позиціонуємо підказку нижче точки
                    tooltip.style.top = `${dotRect.bottom + 15}px`;
                    tooltip.style.transform = 'translate(-50%, 0)';
                    tooltip.classList.add('tooltip-bottom');
                }
                
                // Перевірка лівого краю
                if (tooltipRect.left < 20) {
                    tooltip.style.left = `${Math.max(20 + tooltipRect.width/2, tooltipLeft)}px`;
                }
                
                // Перевірка правого краю
                if (tooltipRect.right > window.innerWidth - 20) {
                    tooltip.style.left = `${Math.min(window.innerWidth - 20 - tooltipRect.width/2, tooltipLeft)}px`;
                }
                
                // Встановлюємо видимість підказки
                updateTooltipVisibility();
            });
            
            // Відстежуємо відведення від точки
            dot.addEventListener('mouseleave', () => {
                if (isRulerActive()) return;
                
                isHoveringDot = false;
                // Невелика затримка щоб дати можливість перейти на підказку
                setTimeout(() => updateTooltipVisibility(), 100);
            });
            
            // Відстежуємо наведення на підказку
            tooltip.addEventListener('mouseenter', () => {
                if (isRulerActive()) return;
                
                isHoveringTooltip = true;
                updateTooltipVisibility();
            });
            
            // Відстежуємо відведення від підказки
            tooltip.addEventListener('mouseleave', () => {
                if (isRulerActive()) return;
                
                isHoveringTooltip = false;
                updateTooltipVisibility();
            });
        }
    });
}

// Функція для ініціалізації підказок
export async function initializeTooltips(mapName) {
    console.log('Ініціалізація підказок для карти:', mapName);
    
    // Зберігаємо поточну карту
    currentMapName = mapName;
    
    // Отримуємо всі пости для поточної карти
    allPosts = await getPostsForMap(mapName);
    console.log('Отримано постів:', allPosts.length);
    
    // Видаляємо старий контейнер підказок, якщо він існує
    const oldTooltipContainer = document.querySelector('.tooltip-container');
    if (oldTooltipContainer) {
        oldTooltipContainer.remove();
    }
    
    // Створюємо новий контейнер для підказок
    tooltipContainer = document.createElement('div');
    tooltipContainer.className = 'tooltip-container';
    document.body.appendChild(tooltipContainer);
    
    // Встановлюємо прапорець ініціалізації
    isTooltipsInitialized = true;
    
    // Відстежуємо зміни стану рулетки
    const rulerCheckbox = document.querySelector('#ruler-switch-checkbox');
    if (rulerCheckbox) {
        rulerCheckbox.addEventListener('change', bindTooltipsToDots);
    }
    
    // Початкова прив'язка підказок
    bindTooltipsToDots();
    
    // Обробник подій фільтрації
    document.addEventListener('postsFiltered', (event) => {
        console.log('Подія postsFiltered:', event.detail);
        setTimeout(bindTooltipsToDots, 300);
    });
    
    // Обробник подій оновлення точок
    document.addEventListener('dotsUpdated', (event) => {
        console.log('Подія dotsUpdated:', event.detail);
        setTimeout(bindTooltipsToDots, 300);
    });
    
    // Спостерігаємо за змінами в контейнері постів
    const postsContainer = document.getElementById('posts-container');
    if (postsContainer) {
        const observer = new MutationObserver((mutations) => {
            // Перевіряємо, чи зміни впливають на відображення постів
            const styleChanges = mutations.some(mutation => 
                mutation.type === 'attributes' && mutation.attributeName === 'style');
                
            const childChanges = mutations.some(mutation => 
                mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0));
                
            if (styleChanges || childChanges) {
                console.log('Зміна в контейнері постів виявлена');
                setTimeout(bindTooltipsToDots, 300);
            }
        });
        
        observer.observe(postsContainer, { 
            childList: true,
            subtree: true, 
            attributes: true, 
            attributeFilter: ['style'] 
        });
    }
}

// Функція для перезавантаження підказок
export function refreshTooltips() {
    if (isTooltipsInitialized && currentMapName) {
        console.log('Перезавантаження підказок');
        bindTooltipsToDots();
    }
}
