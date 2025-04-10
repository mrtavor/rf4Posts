export function loadMapData() {
    return fetch('data/maps_data.json')
      .then(res => {
        if (!res.ok) throw new Error('Не вдалося завантажити дані карти');
        return res.json();
      });
}

export function syncDotsLayerSize(imageId) {
    const img = document.getElementById(imageId);
    const dotsLayer = document.getElementById('dots-layer');
  
    if (!img || !dotsLayer) return;
  
    // Перевіряємо, чи зображення вже завантажене
    if (!img.complete) {
      img.onload = () => syncDotsLayerSize(imageId);
      return;
    }
  
    const rect = img.getBoundingClientRect();
  
    dotsLayer.style.width = `${rect.width}px`;
    dotsLayer.style.height = `${rect.height}px`;

    console.log('image size:', img.clientWidth, img.clientHeight);
    console.log('dots-layer set to:', dotsLayer.style.width, dotsLayer.style.height);
  }

export function drawCircleOnMap(imageId, gameCoords, mapData) {
    const img = document.getElementById(imageId);
    const dotsLayer = document.getElementById('dots-layer');

    if (!img || !mapData) return;

    const mapInfo = mapData.find(m => normalize(m.name) === normalizeFromURL());

    if (!mapInfo) {
      console.error('Не знайдено інформації про мапу');
      return;
    }

    const { left_top, right_bottom } = mapInfo.game_coords;

    // Логування даних перед обчисленнями
    console.log('Дані мапи:', mapInfo);
    console.log('left_top:', left_top, 'right_bottom:', right_bottom);
    console.log('gameCoords:', gameCoords);
    console.log('maxY:', right_bottom[1], 'minY:', left_top[1]);

    // Отримуємо розміри карти з урахуванням реальних розмірів на сторінці
    const mapRect = img.getBoundingClientRect();
    const mapWidth = mapRect.width;
    const mapHeight = mapRect.height;

    const minX = left_top[0];
    const maxX = right_bottom[0];
    const maxY = left_top[1];
    const minY = right_bottom[1];

    // Розрахунок масштабу
    const scaleX = mapWidth / (maxX - minX);
    const scaleY = mapHeight / (maxY - minY);

    // Перетворення ігрових координат у піксельні
    const x_pixel = (gameCoords.x - minX) * scaleX;
    const y_pixel = mapHeight - (gameCoords.y - minY) * scaleY;

    // Логування обчислених координат
    console.log(`Розраховані координати для кружечка: X: ${x_pixel.toFixed(2)}, Y: ${y_pixel.toFixed(2)}`);

    // Створення кружечка
    const circle = document.createElement('div');
    circle.className = 'circle-marker';
    circle.style.position = 'absolute';
    circle.style.width = '10px';
    circle.style.height = '10px';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = 'red';
    circle.style.left = `${x_pixel}px`;
    circle.style.top = `${y_pixel}px`;
    circle.style.pointerEvents = 'none';

    dotsLayer.appendChild(circle);
}

// Допоміжні функції
function normalize(str) {
    return str.toLowerCase().replace(/[^а-яa-z0-9]/gi, '');
}

function normalizeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title') || '';
    return normalize(title);
}

export function addCirclePoint(gameCoords) {
  allPoints.push(gameCoords);
}

export function redrawAllPoints(imageId, mapData, allPoints) {
    const dotsLayer = document.getElementById('dots-layer');
    dotsLayer.innerHTML = ''; // Очистити старі точки
  
    allPoints.forEach(coords => {
      drawCircleOnMap(imageId, coords, mapData);
    });
  }