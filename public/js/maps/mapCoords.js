// Загружает данные о картах из файла maps_data.json
export function loadMapData() {
    // Визначаємо всі можливі шляхи до файлу
    const possiblePaths = [
        '/data/map-data/maps_data.json',            // абсолютний шлях
        './data/map-data/maps_data.json',           // відносний шлях
        '../data/map-data/maps_data.json',          // відносний шлях, якщо запит з підпапки
        '../../data/map-data/maps_data.json',       // альтернативний відносний шлях
        window.location.origin + '/data/map-data/maps_data.json' // повний URL
    ];
    
    console.log('Спроба завантаження даних карт. Доступні шляхи:', possiblePaths);
    
    // Функція для перевірки і завантаження JSON
    const tryFetch = (path, index = 0) => {
        if (index >= possiblePaths.length) {
            console.error('Не вдалося завантажити JSON з жодного шляху');
            return Promise.resolve([]); // повертаємо пустий масив
        }
        
        const currentPath = possiblePaths[index];
        console.log(`Спроба ${index + 1}/${possiblePaths.length}: завантаження з ${currentPath}`);
        
        return fetch(currentPath)
            .then(res => {
                if (!res.ok) {
                    console.warn(`Шлях ${currentPath} - помилка ${res.status}`);
                    return tryFetch(null, index + 1);
                }
                console.log(`Успішно завантажено з ${currentPath}`);
                return res.json().catch(err => {
                    console.error(`Помилка парсингу JSON з ${currentPath}:`, err);
                    return tryFetch(null, index + 1);
                });
            })
            .catch(err => {
                console.warn(`Помилка запиту до ${currentPath}:`, err);
                return tryFetch(null, index + 1);
            });
    };
    
    return tryFetch(possiblePaths[0])
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                console.log(`Успішно завантажено дані для ${data.length} карт`);
                return data;
            } else {
                console.warn('Завантажені дані порожні або не є масивом');
                return [];
            }
        });
}

// Синхронизирует размеры слоя точек с размерами изображения карты
export function syncDotsLayerSize(imageId) {
    const img = document.getElementById(imageId);
    const dotsLayer = document.getElementById('dots-layer');
  
    if (!img || !dotsLayer) return;
  
    // Проверяем, загружено ли изображение
    if (!img.complete) {
      img.onload = () => syncDotsLayerSize(imageId);
      return;
    }
  
    const rect = img.getBoundingClientRect();
  
    dotsLayer.style.width = `${rect.width}px`;
    dotsLayer.style.height = `${rect.height}px`;
}

// Рисует одну точку на карте по игровым координатам
export function drawCircleOnMap(imageId, gameCoords, mapData, mapName) {
    const img = document.getElementById(imageId);
    const dotsLayer = document.getElementById('dots-layer');

    if (!img || !mapData) {
        console.error('Отсутствуют необходимые элементы');
        return;
    }

    const mapInfo = mapData.find(m => m.name === mapName);

    if (!mapInfo) {
        console.error('Не найдена информация о карте');
        return;
    }

    const { left_top, right_bottom } = mapInfo.game_coords;

    // Получаем размеры карты в пикселях
    const mapRect = img.getBoundingClientRect();
    const mapWidth = mapRect.width;
    const mapHeight = mapRect.height;

    const minX = left_top[0];
    const maxX = right_bottom[0];
    const maxY = left_top[1];
    const minY = right_bottom[1];

    // Вычисляем масштаб по осям
    const scaleX = mapWidth / (maxX - minX);
    const scaleY = mapHeight / (maxY - minY);

    // Переводим игровые координаты в пиксельные
    const x_pixel = ((gameCoords.x) - minX) * scaleX;
    const y_pixel = mapHeight - ((gameCoords.y) - minY) * scaleY;

    // Создаем точку
    const circle = document.createElement('div');
    circle.className = 'map-dot';
    circle.style.left = `${x_pixel}px`;
    circle.style.top = `${y_pixel}px`;
    
    // Добавляем data-атрибуты для координат
    circle.dataset.coordX = gameCoords.x;
    circle.dataset.coordY = gameCoords.y;

    // Добавляем точку на слой
    dotsLayer.appendChild(circle);
}

// Вспомогательная функция для нормализации строки (убирает лишние символы и приводит к нижнему регистру)
function normalize(str) {
    return str.toLowerCase().replace(/[^а-яa-z0-9]/gi, '');
}

// Получает нормализованное название карты из URL
function normalizeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title') || '';
    return normalize(title);
}

// Добавляет игровые координаты в переданный массив всех точек
export function addCirclePoint(allPoints, gameCoords) {
  allPoints.push(gameCoords);
}

// Перерисовывает все точки на карте
export function redrawAllPoints(imageId, mapData, allPoints, mapName) {
    const dotsLayer = document.getElementById('dots-layer');
    dotsLayer.innerHTML = ''; // Очищаем старые точки
  
    allPoints.forEach(coords => {
      drawCircleOnMap(imageId, coords, mapData, mapName);
    });
}

// Извлекает игровые координаты из текста (например, из описания поста)
export function extractCoordinates(text) {
    // Используем тот же паттерн, что и в postHoverHandler.js
    const match = text.match(/(\d{1,3})[:,\s](\d{1,3})/);
    if (match) {
        return {
            x: parseFloat(match[1]),
            y: parseFloat(match[2])
        };
    }
    return null;
}

export function getMouseGameCoords(event, imageId, mapData, mapName) {
    const img = document.getElementById(imageId);
    const mapInfo = mapData.find(m => m.name === mapName);
    if (!img || !mapInfo || !mapInfo.mouse_coords) return null;

    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { left_top, right_bottom } = mapInfo.mouse_coords;

    const minX = left_top[0];
    const maxX = right_bottom[0];
    const maxY = left_top[1];
    const minY = right_bottom[1];

    const mapWidth = rect.width;
    const mapHeight = rect.height;

    // Зворотній розрахунок: пікселі → ігрові координати
    const gameX = minX + (x / mapWidth) * (maxX - minX);
    const gameY = minY + ((mapHeight - y) / mapHeight) * (maxY - minY);

    return { x: gameX, y: gameY };
}

// Перетворює ігрові координати у піксельні координати на карті
export function gameCoordsToImagePosition(coords, mapData, mapName) {
    const img = document.getElementById('image');
    const mapInfo = mapData.find(m => m.name === mapName);
    if (!img || !mapInfo || !mapInfo.game_coords) return null;
  
    const rect = img.getBoundingClientRect();
    const { left_top, right_bottom } = mapInfo.game_coords;
  
    const minX = left_top[0];
    const maxX = right_bottom[0];
    const maxY = left_top[1];
    const minY = right_bottom[1];
  
    const mapWidth = rect.width;
    const mapHeight = rect.height;
  
    const scaleX = mapWidth / (maxX - minX);
    const scaleY = mapHeight / (maxY - minY);
  
    const x_pixel = ((coords.x) - minX) * scaleX;
    const y_pixel = mapHeight - ((coords.y) - minY) * scaleY;
  
    return { x: x_pixel, y: y_pixel };
  }
