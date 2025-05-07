import { fishDatabase } from '../../../data/fish-database.js';
import { redrawVisiblePoints } from '../../maps/mapCoords.js';
import { mapsData } from '../../maps/mapsData.js';
import mapManager from '../../maps/mapDataManager.js';

class PostsFilter {
    constructor() {
        this.timeFilter = document.getElementById('time-filter');
        this.addFilterBtn = document.getElementById('add-filter-btn');
        this.filterDropdown = document.getElementById('filter-dropdown');
        this.postsContainer = document.getElementById('posts-container');
        this.fishFilterSelect = document.getElementById('fish-filter');
        
        // Створюємо повідомлення про відсутність постів
        this.noPostsMessage = document.createElement('div');
        this.noPostsMessage.className = 'no-posts-message hidden';
        this.noPostsMessage.textContent = 'За обраними фільтрами немає постів';
        if (this.postsContainer) {
            this.postsContainer.parentNode.insertBefore(this.noPostsMessage, this.postsContainer.nextSibling);
        }
        
        // Створюємо контейнер для фільтрів риб та кнопки очищення
        this.filterBarContainer = document.createElement('div');
        this.filterBarContainer.className = 'fish-filter-bar';
        
        // Створюємо кнопку очищення фільтрів
        this.clearFiltersBtn = document.createElement('button');
        this.clearFiltersBtn.className = 'clear-filters-btn hidden';
        this.clearFiltersBtn.textContent = 'Стерти все';
        this.clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());
        
        // Створюємо контейнер для дій з фільтрами
        this.filterActionsContainer = document.createElement('div');
        this.filterActionsContainer.className = 'filter-actions-container';
        
        // Додаємо контейнери в DOM
        if (this.addFilterBtn && this.addFilterBtn.parentNode) {
            this.filterActionsContainer.appendChild(this.addFilterBtn.cloneNode(true));
            this.filterActionsContainer.appendChild(this.clearFiltersBtn);
            
            // Заміняємо оригінальну кнопку на наш контейнер з діями
            this.addFilterBtn.parentNode.replaceChild(this.filterActionsContainer, this.addFilterBtn);
            
            // Оновлюємо посилання на нову кнопку
            this.addFilterBtn = this.filterActionsContainer.querySelector('#add-filter-btn');
            
            // Додаємо контейнер для фільтрів риб перед контейнером дій
            this.filterActionsContainer.parentNode.insertBefore(this.filterBarContainer, this.filterActionsContainer);
        }
        
        this.activeFilters = new Set();
        this.addedFilters = new Set(); // Множина для зберігання всіх доданих фільтрів
        
        // Нормалізуємо базу даних риб для пошуку
        this.normalizedFishDatabase = this.getNormalizedFishDatabase();
        
        this.init();
        
        // Слухаємо подію завантаження постів
        document.addEventListener('postsLoaded', () => {
            console.log('Posts loaded event detected');
            this.updateFishFilterOptions();
        });
    }
    
    // Метод, який можна викликати після завантаження постів
    updateAfterPostsLoaded() {
        console.log('Updating filter after posts loaded');
        this.updateFishFilterOptions();
    }

    async loadPostsFromFirestore() {
        // Отримуємо поточну карту
        const urlParams = new URLSearchParams(window.location.search);
        const mapKey = urlParams.get('title');
        if (!mapKey) {
            console.error('No map key found in URL');
            return [];
        }
        
        // Отримуємо дані карти
        const mapData = mapsData[mapKey];
        if (!mapData) {
            console.error('Map data not found for key:', mapKey);
            return [];
        }
        
        // Отримуємо назву карти для запиту до Firestore
        const firestoreMapKey = mapData.map;
        console.log('Loading posts for map:', firestoreMapKey);
        
        try {
            // Створюємо запит до Firestore
            const db = window.firebase ? window.firebase.firestore() : null;
            if (!db) {
                console.error('Firestore не доступний');
                return [];
            }
            
            const postsRef = db.collection('posts');
            const q = postsRef.where('map', '==', firestoreMapKey);
            const snapshot = await q.get();
            
            const posts = [];
            snapshot.forEach(doc => {
                posts.push(doc.data());
            });
            
            console.log(`Retrieved ${posts.length} posts from Firestore`);
            return posts;
        } catch (error) {
            console.error('Error loading posts from Firestore:', error);
            return [];
        }
    }

    init() {
        // Додаємо обробник подій для кнопки фільтра
        if (this.addFilterBtn) {
            this.addFilterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFilterDropdown();
            });
        }

        // Додаємо обробник для фільтра часу
        if (this.timeFilter) {
            this.timeFilter.addEventListener('change', () => {
                this.updateFishFilterOptions();
                this.applyFilters();
            });
        }
        
        // Додаємо обробник для фільтра риб
        if (this.fishFilterSelect) {
            this.fishFilterSelect.addEventListener('change', () => {
                const selectedFish = this.fishFilterSelect.value;
                if (selectedFish !== 'all') {
                    this.addFishFilter(selectedFish);
                }
                this.applyFilters();
            });
        }
        
        // Додаємо обробник кліку поза фільтром для його закриття
        document.addEventListener('click', (e) => {
            if (this.filterDropdown && !this.filterDropdown.classList.contains('hidden')) {
                // Перевіряємо, чи клік був не на фільтрі або кнопці фільтра
                if (!this.filterDropdown.contains(e.target) && 
                    !this.addFilterBtn.contains(e.target)) {
                    this.toggleFilterDropdown();
                }
            }
        });
        
        // Ініціалізуємо таби
        this.initTabs();
        
        // Оновлюємо фільтр риб після повного завантаження DOM
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.updateFishFilterOptions();
            }, 1000); // Даємо час на завантаження постів
        });
    }

    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        const tabButtons = document.querySelectorAll('.tab-button');
        const postsContainer = document.getElementById('posts-container');
        const baitsContainer = document.getElementById('baits-container');

        tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabName);
        });

        if (tabName === 'posts') {
            postsContainer.style.display = '';
            baitsContainer.style.display = 'none';
        } else {
            postsContainer.style.display = 'none';
            baitsContainer.style.display = '';
        }
    }

    toggleFilterDropdown() {
        if (this.filterDropdown) {
            const isHidden = this.filterDropdown.classList.contains('hidden');
            
            // Анімація опускання постів
            if (this.postsContainer) {
                if (isHidden) {
                    // Показуємо фільтр - починаємо анімацію
                    this.postsContainer.style.transition = 'transform 0.3s ease-in-out';
                    this.filterDropdown.style.opacity = '0';
                    this.filterDropdown.classList.remove('hidden');
                    
                    // Даємо час для відображення елемента перед зміною opacity
                    setTimeout(() => {
                        this.filterDropdown.style.opacity = '1';
                        const filterHeight = this.filterDropdown.offsetHeight;
                        this.postsContainer.style.transform = `translateY(${filterHeight}px)`;
                    }, 10);
                } else {
                    // Ховаємо фільтр - змінюємо opacity перед приховуванням
                    this.filterDropdown.style.opacity = '0';
                    this.postsContainer.style.transform = 'translateY(0)';
                    
                    // Після завершення анімації повністю ховаємо фільтр
                    setTimeout(() => {
                        this.filterDropdown.classList.add('hidden');
                    }, 300);
                }
            } else {
                // Якщо контейнер постів не знайдено, просто перемикаємо клас
                this.filterDropdown.classList.toggle('hidden');
            }
        }
    }
    
    getNormalizedFishDatabase() {
        return fishDatabase.map(fish => ({
            ...fish,
            normalizedName: this.normalizeFishName(fish.name),
            normalizedVariants: fish.nameVariants.map(variant => this.normalizeFishName(variant))
        }));
    }
    
    updateFishFilterOptions() {
        console.log('=== Updating Fish Filter Options ===');
        
        if (!this.fishFilterSelect || !this.postsContainer) {
            console.warn('Required elements not found');
            return;
        }
        
        // Зберігаємо попередньо вибране значення
        const previousValue = this.fishFilterSelect.value;
        
        // Зберігаємо список вже доданих фільтрів
        const addedFishNames = Array.from(this.addedFilters);
        
        // Отримуємо обраний часовий період
        const selectedTime = this.timeFilter ? parseInt(this.timeFilter.value) : 14;
        
        // Отримуємо поточну карту
        const urlParams = new URLSearchParams(window.location.search);
        const mapKey = urlParams.get('title');
        if (!mapKey) {
            console.error('No current map key available');
            return;
        }

        // Отримуємо риб для поточної карти за ключем (латиницею)
        const availableFish = this.getNormalizedFishDatabase().filter(fish => 
            fish.locations && fish.locations.includes(mapKey)
        );

        console.log(`Available fish for map ${mapKey}:`, availableFish.length);
        
        // Отримуємо всі пости
        const posts = Array.from(this.postsContainer.children);
        console.log('Загальна кількість постів на сторінці:', posts.length);
        
        // Мапа для зберігання знайдених риб та їх кількості
        const foundFish = new Map();
        
        let postsInTime = 0;
        // Перевіряємо кожен пост
        posts.forEach(post => {
            try {
                // Отримуємо дату поста
                const postDateElement = post.querySelector('.post-date');
                if (!postDateElement) return;
                
                const postDateStr = postDateElement.textContent;
                if (!postDateStr) return;
                
                // Парсимо дату з формату DD.MM.YYYY
                const [day, month, year] = postDateStr.split('.').map(Number);
                const postDate = new Date(year, month - 1, day);
                
                if (isNaN(postDate.getTime())) return;
                
                const currentDate = new Date();
                const daysDiff = Math.floor((currentDate - postDate) / (1000 * 60 * 60 * 24));
                
                // Якщо пост підходить за часовим фільтром
                if (daysDiff <= selectedTime) {
                    postsInTime++;
                    // Отримуємо інформацію про рибу
                    const fishElement = post.querySelector('.post-body div:nth-child(1)');
                    const fishText = fishElement ? fishElement.textContent.replace('Рыба:', '').trim() : '';
                    console.log('Пост у фільтрі часу. fishText:', fishText);
                    
                    if (fishText) {
                        // Шукаємо тільки серед доступних риб для поточної карти
                        availableFish.forEach(fish => {
                            const result = this.containsFish(fishText, fish.name);
                            console.log(`containsFish('${fishText}', '${fish.name}') =`, result);
                            if (result) {
                                foundFish.set(fish.name, (foundFish.get(fish.name) || 0) + 1);
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error updating fish filter:', error);
            }
        });
        console.log('Кількість постів, що підпадають під фільтр часу:', postsInTime);
        console.log('availableFish:', availableFish.map(f=>f.name));
        console.log('foundFish:', Array.from(foundFish.entries()));
        
        // Очищаємо список риб
        while (this.fishFilterSelect.options.length > 1) {
            this.fishFilterSelect.remove(1);
        }
        
        // Якщо немає постів для фільтрації — показуємо повідомлення
        if (postsInTime === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.disabled = true;
            option.selected = true;
            option.textContent = 'Немає риб для фільтрації (немає постів за обраний період)';
            this.fishFilterSelect.appendChild(option);
        } else {
            // Якщо є пости — показуємо знайдені риби (як раніше)
            let fishToShow;
            if (foundFish.size === 0) {
                fishToShow = availableFish.map(fish => [fish.name, null]);
            } else {
                fishToShow = Array.from(foundFish.entries())
                    .filter(([fishName]) => !addedFishNames.includes(fishName))
                    .sort((a, b) => b[1] - a[1]);
            }
            fishToShow.forEach(([fishName, count]) => {
                const option = document.createElement('option');
                option.value = fishName;
                option.textContent = count ? `${fishName} (${count})` : fishName;
            this.fishFilterSelect.appendChild(option);
        });
        }
        
        // Відновлюємо попереднє значення, якщо воно існує в новому списку
        if (previousValue !== 'all') {
            const optionExists = Array.from(this.fishFilterSelect.options).some(option => option.value === previousValue);
            if (optionExists) {
                this.fishFilterSelect.value = previousValue;
            }
        }
        
        // Оновлюємо видимість кнопок фільтрів
        this.updateFilterButtonsVisibility();
        
        console.log('=== Fish Filter Options Update Complete ===');
    }
    
    updateFilterButtonsVisibility() {
        // Отримуємо список всіх доступних риб з випадаючого списку
        const availableFish = new Set(
            Array.from(this.fishFilterSelect.options)
                .map(option => option.value)
                .filter(value => value !== 'all')
        );
        
        // Перевіряємо кожен доданий фільтр
        const filterButtons = this.filterBarContainer.querySelectorAll('.fish-filter-chip');
        filterButtons.forEach(button => {
            const fishName = button.getAttribute('data-fish');
            // Якщо риба недоступна в новому часовому діапазоні - робимо кнопку неактивною
            if (!availableFish.has(fishName)) {
                button.classList.add('unavailable');
                button.title = "Ця риба не зустрічається у вибраному часовому діапазоні";
            } else {
                button.classList.remove('unavailable');
                button.title = "";
            }
        });
    }
    
    findFishInText(fishText, foundFish) {
        console.log('\n--- Searching for Fish Matches ---');
        console.log('Searching in text:', fishText);
        
        // Нормалізуємо весь текст
        const normalizedText = this.normalizeFishName(fishText);
        console.log('Normalized fish text:', normalizedText);
        
        // Отримуємо поточну карту з URL
        const urlParams = new URLSearchParams(window.location.search);
        const mapKey = urlParams.get('title');
        
        if (!mapKey) {
            console.error('No current map key available');
            return;
        }
        
        // Фільтруємо риб, які водяться на поточній карті
        const availableFish = this.getNormalizedFishDatabase().filter(fish => 
            fish.locations && fish.locations.includes(mapKey)
        );
        
        console.log(`Available fish for map ${mapKey}:`, availableFish.length);
        
        // Шукаємо тільки серед доступних риб для поточної карти
        availableFish.forEach(fish => {
            // Спеціальна обробка для риб, які можуть бути сплутані
            if (fish.name === 'Ерш' || fish.name === 'Ерш-носарь') {
                // Для "Ерш" перевіряємо, що в тексті є "ерш", але немає "носарь"
                if (fish.name === 'Ерш' && 
                    normalizedText.includes('ерш') && 
                    !normalizedText.includes('носарь') && 
                    !normalizedText.includes('носаря')) {
                    console.log(`Found fish by strict match: ${fish.name}`);
                    foundFish.set(fish.name, (foundFish.get(fish.name) || 0) + 1);
                    return;
                }
                
                // Для "Ерш-носарь" перевіряємо, що в тексті є "ерш" і "носарь"
                if (fish.name === 'Ерш-носарь' && 
                    normalizedText.includes('ерш') && 
                    (normalizedText.includes('носарь') || normalizedText.includes('носаря'))) {
                    console.log(`Found fish by strict match: ${fish.name}`);
                    foundFish.set(fish.name, (foundFish.get(fish.name) || 0) + 1);
                    return;
                }
            } 
            // Для інших риб використовуємо стандартний пошук
            else if (normalizedText.includes(fish.normalizedName)) {
                console.log(`Found fish by name: ${fish.name}`);
                foundFish.set(fish.name, (foundFish.get(fish.name) || 0) + 1);
                return;
            }
            
            // Перевіряємо варіанти назв
            for (const variant of fish.normalizedVariants) {
                if (normalizedText.includes(variant)) {
                    console.log(`Found fish by variant: ${fish.name}`);
                    foundFish.set(fish.name, (foundFish.get(fish.name) || 0) + 1);
                    return;
                }
            }
        });
    }
    
    addFishFilter(fishName) {
        // Не додаємо дублікати
        if (this.addedFilters.has(fishName)) {
            return;
        }
        
        // Перевіряємо кількість вже доданих фільтрів
        if (this.addedFilters.size >= 4) {
            // Можна додати сповіщення для користувача
            alert('Не можна додати більше 4 фільтрів риб');
            return;
        }
        
        // Додаємо рибу до активних фільтрів та доданих фільтрів
        this.activeFilters.add(fishName);
        this.addedFilters.add(fishName);
        
        // Знаходимо повну назву риби в базі даних, якщо вона там є
        const fishData = fishDatabase.find(fish => fish.name === fishName);
        const fullFishName = fishData ? fishData.name : fishName;
        
        // Створюємо чіп для фільтра з повною назвою риби
        const fishBtn = document.createElement('button');
        fishBtn.className = 'fish-filter-chip active';
        fishBtn.setAttribute('data-fish', fishName);
        fishBtn.textContent = fullFishName; // Використовуємо повну назву риби
        
        // Перевіряємо доступність риби в поточному часовому діапазоні
        const isAvailable = Array.from(this.fishFilterSelect.options).some(option => option.value === fishName);
        if (!isAvailable) {
            fishBtn.classList.add('unavailable');
            fishBtn.title = "Ця риба не зустрічається у вибраному часовому діапазоні";
        }
        
        // Додаємо символ закриття
        const closeSpan = document.createElement('span');
        closeSpan.className = 'filter-close';
        closeSpan.innerHTML = '&times;';
        closeSpan.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFishFilter(fishName);
        });
        
        fishBtn.appendChild(closeSpan);
        
        // Обробник кліку по чіпу
        fishBtn.addEventListener('click', () => {
            fishBtn.classList.toggle('active');
            if (!fishBtn.classList.contains('active')) {
                this.activeFilters.delete(fishName);
            } else {
                this.activeFilters.add(fishName);
            }
            this.updateClearButtonVisibility();
            this.applyFilters();
        });
        
        this.filterBarContainer.appendChild(fishBtn);
        
        // Показуємо кнопку очищення
        this.updateClearButtonVisibility();
        
        // Видаляємо рибу з випадаючого списку
        if (this.fishFilterSelect) {
            for (let i = 0; i < this.fishFilterSelect.options.length; i++) {
                if (this.fishFilterSelect.options[i].value === fishName) {
                    this.fishFilterSelect.remove(i);
                    break;
                }
            }
            // Скидаємо вибір у випадаючому списку
            this.fishFilterSelect.value = 'all';
        }
        
        // Якщо досягнуто максимальну кількість фільтрів (4), блокуємо випадаючий список
        this.updateFilterMaxLimit();
    }
    
    // Метод для оновлення стану випадаючого списку в залежності від кількості доданих фільтрів
    updateFilterMaxLimit() {
        if (!this.fishFilterSelect) return;
        
        if (this.addedFilters.size >= 4) {
            // Блокуємо випадаючий список, якщо вже додано 4 фільтри
            this.fishFilterSelect.disabled = true;
            this.fishFilterSelect.title = "Досягнуто максимальну кількість фільтрів (4)";
        } else {
            // Розблоковуємо випадаючий список, якщо менше 4 фільтрів
            this.fishFilterSelect.disabled = false;
            this.fishFilterSelect.title = "";
        }
    }
    
    removeFishFilter(fishName) {
        // Видаляємо фільтр зі списку активних та доданих
        this.activeFilters.delete(fishName);
        this.addedFilters.delete(fishName);
        
        // Знаходимо і видаляємо кнопку фільтра
        const filterButton = this.filterBarContainer.querySelector(`[data-fish="${fishName}"]`);
        if (filterButton) {
            this.filterBarContainer.removeChild(filterButton);
        }
        
        // Додаємо рибу назад до випадаючого списку
        this.addFishToDropdown(fishName);
        
        // Оновлюємо кнопку очищення та застосовуємо фільтри
        this.updateClearButtonVisibility();
        this.updateFilterMaxLimit();
        this.applyFilters();
    }
    
    // Допоміжний метод для додавання риби назад до випадаючого списку
    addFishToDropdown(fishName) {
        if (!this.fishFilterSelect) return;
        
        // Перевіряємо, чи риба відповідає поточному часовому фільтру
        const selectedTime = this.timeFilter ? parseInt(this.timeFilter.value) : 14;
        let fishCount = 0;
        
        // Отримуємо всі пости
        const posts = Array.from(this.postsContainer.children);
        
        // Шукаємо цю рибу в постах, що відповідають часовому фільтру
        posts.forEach(post => {
            try {
                // Перевіряємо час
                const postDateElement = post.querySelector('.post-date');
                if (!postDateElement) return;
                
                const postDateStr = postDateElement.textContent;
                if (!postDateStr) return;
                
                const [day, month, year] = postDateStr.split('.').map(Number);
                const postDate = new Date(year, month - 1, day);
                
                if (isNaN(postDate.getTime())) return;
                
                const currentDate = new Date();
                const daysDiff = Math.floor((currentDate - postDate) / (1000 * 60 * 60 * 24));
                
                if (daysDiff <= selectedTime) {
                    // Перевіряємо, чи є в пості ця риба
                    const fishElement = post.querySelector('.post-body div:nth-child(1)');
                    const fishText = fishElement ? fishElement.textContent.replace('Рыба:', '').trim() : '';
                    
                    if (this.containsFish(fishText, fishName)) {
                        fishCount++;
                    }
                }
            } catch (error) {
                console.error('Error checking fish in post:', error);
            }
        });
        
        // Якщо риба зустрічається в постах за обраний період - додаємо її до списку
        if (fishCount > 0) {
            // Знаходимо правильне місце для вставки (сортування за алфавітом)
            let insertIndex = 1;  // Перше місце після "Все виды рыб"
            for (let i = 1; i < this.fishFilterSelect.options.length; i++) {
                if (this.fishFilterSelect.options[i].value.localeCompare(fishName) > 0) {
                    insertIndex = i;
                    break;
                }
                insertIndex = i + 1;
            }
            
            // Створюємо нову опцію
            const option = document.createElement('option');
            option.value = fishName;
            option.textContent = `${fishName} (${fishCount})`;
            
            // Додаємо опцію в правильному місці
            if (insertIndex >= this.fishFilterSelect.options.length) {
                this.fishFilterSelect.appendChild(option);
            } else {
                this.fishFilterSelect.insertBefore(option, this.fishFilterSelect.options[insertIndex]);
            }
        }
    }
    
    clearAllFilters() {
        // Збираємо всі додані фільтри перед очищенням
        const addedFishNames = Array.from(this.addedFilters);
        
        // Очищаємо всі активні фільтри та додані фільтри
        this.activeFilters.clear();
        this.addedFilters.clear();
        
        // Видаляємо всі кнопки фільтрів
        this.filterBarContainer.innerHTML = '';
        
        // Ховаємо кнопку очищення
        this.updateClearButtonVisibility();
        
        // Повертаємо всі риби назад до випадаючого списку
        addedFishNames.forEach(fishName => {
            this.addFishToDropdown(fishName);
        });
        
        // Скидаємо значення випадаючого списку і розблоковуємо його
        if (this.fishFilterSelect) {
            this.fishFilterSelect.value = 'all';
            this.updateFilterMaxLimit();
        }
        
        // Застосовуємо фільтри
        this.applyFilters();
    }
    
    updateClearButtonVisibility() {
        // Показуємо кнопку "Стерти все", якщо є будь-які додані фільтри
        if (this.addedFilters.size > 0) {
            this.clearFiltersBtn.classList.remove('hidden');
            // Додаємо відступ згори для рядка фільтрів, коли в ньому є хоча б один фільтр
            this.filterBarContainer.style.marginTop = '10px';
            // Додаємо padding та рамку для контейнера фільтрів
            this.filterBarContainer.style.padding = '10px';
            this.filterBarContainer.style.border = '2px solid #ededed';
            this.filterBarContainer.style.borderRadius = '10px';
        } else {
            this.clearFiltersBtn.classList.add('hidden');
            // Видаляємо відступ згори та стилі рамки, коли немає фільтрів
            this.filterBarContainer.style.marginTop = '0';
            this.filterBarContainer.style.padding = '0';
            this.filterBarContainer.style.border = 'none';
            this.filterBarContainer.style.borderRadius = '0';
        }
    }

    applyFilters() {
        if (!this.postsContainer) return;

        const selectedTime = this.timeFilter ? parseInt(this.timeFilter.value) : 14;
        
        // Отримуємо всі пости
        const posts = Array.from(this.postsContainer.children);
        
        // Отримуємо список усіх доступних риб з випадаючого списку
        const availableFish = new Set(
            Array.from(this.fishFilterSelect.options)
                .map(option => option.value)
                .filter(value => value !== 'all')
        );
        
        // Фільтруємо пости
        let visiblePostsCount = 0;
        
        posts.forEach(post => {
            try {
                // Отримуємо дату поста з елемента post-date
                const postDateElement = post.querySelector('.post-date');
                if (!postDateElement) {
                    post.style.display = 'block';
                    visiblePostsCount++;
                    return;
                }

                const postDateStr = postDateElement.textContent;
                if (!postDateStr) {
                    post.style.display = 'block';
                    visiblePostsCount++;
                    return;
                }

                // Парсимо дату з формату DD.MM.YYYY
                const [day, month, year] = postDateStr.split('.').map(Number);
                const postDate = new Date(year, month - 1, day);
                
                if (isNaN(postDate.getTime())) {
                    post.style.display = 'block';
                    visiblePostsCount++;
                    return;
                }

                const currentDate = new Date();
                const daysDiff = Math.floor((currentDate - postDate) / (1000 * 60 * 60 * 24));
                
                // Перевіряємо фільтр часу
                const passesTimeFilter = daysDiff <= selectedTime;
                
                // Отримуємо інформацію про рибу з поста
                const fishElement = post.querySelector('.post-body div:nth-child(1)');
                const fishText = fishElement ? fishElement.textContent.replace('Рыба:', '').trim() : '';
                
                // Перевіряємо фільтри риб (тільки активні фільтри)
                let passesFishFilter = this.activeFilters.size === 0 || 
                    Array.from(this.activeFilters).some(fishName => {
                        // Перевіряємо, чи фільтр досі активний
                        const filterBtn = this.filterBarContainer.querySelector(`[data-fish="${fishName}"]`);
                        return filterBtn && 
                            filterBtn.classList.contains('active') && 
                            this.containsFish(fishText, fishName);
                    });
                
                // Застосовуємо всі фільтри
                const isVisible = passesTimeFilter && passesFishFilter;
                post.style.display = isVisible ? 'block' : 'none';
                
                if (isVisible) {
                    visiblePostsCount++;
                }
            } catch (error) {
                console.error('Error filtering post:', error);
                post.style.display = 'block';
                visiblePostsCount++;
            }
        });
        
        // Показуємо або ховаємо повідомлення про відсутність постів
        if (visiblePostsCount === 0 && posts.length > 0) {
            this.noPostsMessage.classList.remove('hidden');
            
            // Додаємо кнопку скидання фільтрів, якщо є активні фільтри
            const hasActiveFilters = this.activeFilters.size > 0 || 
                (this.timeFilter && parseInt(this.timeFilter.value) < 30);
                
            if (hasActiveFilters) {
                if (!this.noPostsMessage.querySelector('.reset-filters-btn')) {
                    const resetBtn = document.createElement('button');
                    resetBtn.className = 'reset-filters-btn';
                    resetBtn.textContent = 'Скинути фільтри';
                    resetBtn.addEventListener('click', () => {
                        this.clearAllFilters();
                        if (this.timeFilter) {
                            this.timeFilter.value = '30';
                        }
                        this.updateFishFilterOptions();
                        this.applyFilters();
                    });
                    this.noPostsMessage.appendChild(resetBtn);
                }
            } else {
                const resetBtn = this.noPostsMessage.querySelector('.reset-filters-btn');
                if (resetBtn) {
                    resetBtn.remove();
                }
            }
        } else {
            this.noPostsMessage.classList.add('hidden');
        }
        
        // Оновлюємо точки на карті у відповідності до відфільтрованих постів
        this.updateMapPoints();
        
        // Створюємо подію для сповіщення про зміну відображення постів
        const filterChangeEvent = new CustomEvent('postsFiltered', { 
            detail: { visiblePostsCount, totalPosts: posts.length } 
        });
        document.dispatchEvent(filterChangeEvent);
    }
    
    containsFish(fishText, fishName) {
        // Нормалізуємо текст поста та назву риби
        const normalizedFishText = this.normalizeFishName(fishText);
        const normalizedFishName = this.normalizeFishName(fishName);
        
        // Спеціальна обробка для риб, які можуть бути сплутані
        if (fishName === 'Ерш') {
            return normalizedFishText.includes('ерш') && 
                !normalizedFishText.includes('носарь') && 
                !normalizedFishText.includes('носаря');
        }
        
        if (fishName === 'Ерш-носарь') {
            return normalizedFishText.includes('ерш') && 
                (normalizedFishText.includes('носарь') || normalizedFishText.includes('носаря'));
        }
        
        return normalizedFishText.includes(normalizedFishName);
    }
    
    normalizeFishName(name) {
        // Список риб, які можуть бути сплутані (для точнішого порівняння)
        const specialFishPairs = [
            { base: 'ерш', variant: 'ерш носарь' },
            { base: 'ерш носарь', variant: 'ерш' }
        ];
        
        // Перевіряємо, чи є ця риба особливим випадком
        for (const pair of specialFishPairs) {
            if (name.toLowerCase().includes(pair.base) && !name.toLowerCase().includes(pair.variant)) {
                // Це спеціальна риба, повертаємо її нормалізоване ім'я без змін у ключових словах
                return name.toLowerCase()
                    .replace(/[-,=+.\[\](){}]/g, ' ') // Замінюємо спеціальні символи на пробіли
                    .replace(/\s+/g, ' ')
                    .trim();
            }
        }
        
        // Слова, які потрібно видалити
        const removeWords = ['трофей', 'трофеи', 'трофейная', 'трофейный', 'синий', 'синяя', 'синее', 'синие', 'большой', 'большая', 'большое', 'большие'];
        
        // Замінюємо спеціальні символи на пробіли
        let normalized = name
            .toLowerCase()
            .replace(/[-,=+.\[\](){}]/g, ' ') // Додано дужки та інші спеціальні символи
            .replace(/\s+/g, ' ')
            .trim();

        // Видаляємо зайві слова
        removeWords.forEach(word => {
            normalized = normalized.replace(new RegExp(`\\b${word}\\b`, 'g'), '');
        });

        // Видаляємо зайві пробіли після видалення слів
        normalized = normalized.replace(/\s+/g, ' ').trim();

        return normalized;
    }

    // Допоміжний метод для оновлення точок на карті
    updateMapPoints() {
        // Отримуємо назву поточної карти з URL
        const urlParams = new URLSearchParams(window.location.search);
        const mapKey = urlParams.get('title');
        
        if (!mapKey) return;
        
        // Отримуємо дані про карту
        const mapData = mapManager.getMapData(mapKey);
        const mapName = mapData ? mapData.title : mapsData[mapKey]?.name;
        
        if (!mapName) return;
        
        // Перемальовуємо точки для видимих постів
        redrawVisiblePoints('image', mapManager.mapJsonData, mapName);
    }

    getMapNameFromTitle(title) {
        if (!title) return null;
        const mapData = mapsData[title];
        return mapData ? mapData.map : null;
    }
}

// Ініціалізуємо фільтр після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    const postsFilter = new PostsFilter();
});

export default PostsFilter;
