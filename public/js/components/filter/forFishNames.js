import { fishDatabase } from '../../../data/fish-database.js';
import { mapsData } from '../../maps/mapsData.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, initializeFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, firestoreSettings } from '../../utils/firebase-config.js';

console.log('=== forFishNames.js loaded ===');

// Ініціалізуємо Firebase
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = initializeFirestore(app, firestoreSettings);
} catch (error) {
    console.error('Помилка ініціалізації Firebase:', error);
}

class FishNamesProcessor {
    constructor() {
        try {
            console.log('=== FishNamesProcessor Constructor ===');
            this.fishFilter = document.getElementById('fish-filter');
            this.postsContainer = document.getElementById('posts-container');
            
            // Отримуємо назву карти з URL
            const urlParams = new URLSearchParams(window.location.search);
            const mapKey = urlParams.get('title');
            console.log('URL map title:', mapKey);
            
            // Визначаємо ключ карти для фільтрації риб
            this.currentMapKey = mapKey;
            
            if (!this.fishFilter || !this.postsContainer || !this.currentMapKey) {
                console.error('Required elements not found');
                return;
            }
            
            console.log('Current map key:', this.currentMapKey);
            console.log('Available maps in mapsData:', Object.keys(mapsData));
            console.log('Fish filter element:', this.fishFilter);
            console.log('Posts container element:', this.postsContainer);

            // Нормалізуємо назви риб з бази даних при ініціалізації
            this.normalizedFishDatabase = fishDatabase.map(fish => ({
                ...fish,
                normalizedName: this.normalizeFishName(fish.name),
                normalizedVariants: fish.nameVariants.map(variant => this.normalizeFishName(variant))
            }));
        } catch (error) {
            console.error('Error in FishNamesProcessor constructor:', error);
        }
    }

    getMapNameFromTitle(title) {
        if (!title) return null;
        const mapData = mapsData[title];
        return mapData ? mapData.map : null;
    }

    async getPostsForMap(mapName) {
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
            return querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
        } catch (error) {
            console.error('Помилка отримання постів:', error);
            return [];
        }
    }

    init() {
        console.log('=== Starting Fish Names Processing ===');
        this.processPostsFromFirestore();
    }

    async processPostsFromFirestore() {
        console.log('\n=== Processing Posts from Firestore ===');
        
        if (!this.currentMapName) {
            console.error('No current map name available');
            return;
        }

        // Отримуємо ключ карти з mapsData
        const mapKey = Object.entries(mapsData).find(([key, value]) => value.map === this.currentMapName)?.[0];
        
        if (!mapKey) {
            console.error('Map key not found for:', this.currentMapName);
            return;
        }

        console.log('Current map name:', this.currentMapName);
        console.log('Map key:', mapKey);

        // Використовуємо значення map з mapsData для запиту до Firestore
        const firestoreMapKey = mapsData[mapKey].map;
        console.log('Firestore map key:', firestoreMapKey);

        const posts = await this.getPostsForMap(firestoreMapKey);
        console.log(`Total posts found: ${posts.length}`);

        if (posts.length === 0) {
            console.warn('No posts found to process');
            return;
        }

        const foundFish = new Map();
        const currentDate = new Date();

        posts.forEach(post => {
            try {
                // Перевіряємо дату поста
                if (post.date) {
                    const [day, month, year] = post.date.split('.').map(Number);
                    const postDate = new Date(year, month - 1, day);
                    
                    if (isNaN(postDate.getTime())) {
                        console.warn('Invalid post date:', post.date);
                        return;
                    }

                    // Отримуємо вибраний часовий фільтр
                    const timeFilterSelect = document.getElementById('time-filter');
                    const selectedTime = timeFilterSelect ? parseInt(timeFilterSelect.value) : 30; // За замовчуванням 30 днів
                    
                    const daysDiff = Math.floor((currentDate - postDate) / (1000 * 60 * 60 * 24));
                    
                    // Перевіряємо чи пост підходить під часовий фільтр
                    if (daysDiff <= selectedTime) {
                        if (post.fish) {
                            this.findMatchingFish(post.fish, foundFish, post);
                        }
                    }
                }
            } catch (error) {
                console.error('Error processing post:', error);
            }
        });

        console.log('\n=== Found Fish Summary ===');
        console.log('Total unique fish found:', foundFish.size);
        console.log('Fish details:', Array.from(foundFish.entries()));
        this.updateFishFilter(foundFish);
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

    findMatchingFish(fishText, foundFish, post) {
        console.log('\n--- Searching for Fish Matches ---');
        console.log('Searching in text:', fishText);
        console.log('Post URL:', post.post_URL);
        
        // Нормалізуємо весь текст
        const normalizedText = this.normalizeFishName(fishText);
        console.log('Normalized fish text:', normalizedText);
        
        // Для кожної риби в базі даних
        this.normalizedFishDatabase.forEach(fish => {
            let found = false;
            
            // Спеціальна обробка для риб, які можуть бути сплутані
            if (fish.name === 'Ерш' || fish.name === 'Ерш-носарь') {
                // Для "Ерш" перевіряємо, що в тексті є "ерш", але немає "носарь"
                if (fish.name === 'Ерш' && 
                    normalizedText.includes('ерш') && 
                    !normalizedText.includes('носарь') && 
                    !normalizedText.includes('носаря')) {
                    found = true;
                }
                
                // Для "Ерш-носарь" перевіряємо, що в тексті є "ерш" і "носарь"
                if (fish.name === 'Ерш-носарь' && 
                    normalizedText.includes('ерш') && 
                    (normalizedText.includes('носарь') || normalizedText.includes('носаря'))) {
                    found = true;
                }
            } 
            // Для інших риб використовуємо стандартний пошук
            else if (normalizedText.includes(fish.normalizedName)) {
                found = true;
            } else {
                // Перевіряємо варіанти назв
                for (const variant of fish.normalizedVariants) {
                    if (normalizedText.includes(variant)) {
                        found = true;
                        break;
                    }
                }
            }

            if (found) {
                console.log(`Found fish: ${fish.name}`);
                if (!foundFish.has(fish.name)) {
                    foundFish.set(fish.name, { count: 0, urls: new Set() });
                }
                const fishData = foundFish.get(fish.name);
                fishData.count++;
                if (post.post_URL) {
                    fishData.urls.add(post.post_URL);
                    console.log(`Added URL for ${fish.name}: ${post.post_URL}`);
                }
                console.log(`Updated count for ${fish.name}: ${fishData.count}`);
                console.log(`URLs for ${fish.name}:`, Array.from(fishData.urls));
            }
        });
    }

    updateFishFilter(foundFish) {
        console.log('\n=== Updating Fish Filter ===');
        
        if (!this.fishFilter) {
            console.warn('Fish filter element not found');
            return;
        }

        // Очищаємо поточні опції, крім "Все виды рыб"
        console.log('Clearing existing fish options');
        while (this.fishFilter.options.length > 1) {
            this.fishFilter.remove(1);
        }

        // Якщо немає знайдених риб - показуємо повідомлення
        if (foundFish.size === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.disabled = true;
            option.selected = true;
            option.textContent = 'Нет рыб для фильтрации';
            this.fishFilter.appendChild(option);
            return;
        }

        // Додаємо знайдені види риб
        console.log('Adding found fish to filter');
        foundFish.forEach((data, fishName) => {
            const option = document.createElement('option');
            option.value = fishName;
            option.textContent = `${fishName} (${data.count})`;
            this.fishFilter.appendChild(option);
            console.log(`Added to filter: ${fishName} (${data.count})`);
            console.log(`Associated URLs for ${fishName}:`, Array.from(data.urls));
        });
        
        console.log('=== Fish Filter Update Complete ===');
    }
}

// Ініціалізуємо обробник після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('=== DOM Content Loaded - Initializing FishNamesProcessor ===');
        const fishProcessor = new FishNamesProcessor();
        fishProcessor.init();
    } catch (error) {
        console.error('Error initializing FishNamesProcessor:', error);
    }
});

export default FishNamesProcessor;
