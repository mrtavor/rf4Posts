import {
  getCurrentZoom,
  getLastTranslate,
  applyTransform
} from './mapZoom.js';
import {
  loadMapData,
  gameCoordsToImagePosition,
  drawCircleOnMap,
  syncDotsLayerSize
} from './mapCoords.js';
import { mapsData } from './mapsData.js';

export function setupCoordsInput(params) {
  // Получаем элементы интерфейса
  const coordXInput = document.getElementById('coord-x');
  const coordYInput = document.getElementById('coord-y');
  const showCoordBtn = document.getElementById('show-coord-btn');
  
  // Получаем параметры
  const { mapData, title, mapsData: passedMapsData } = params || {};
  
  // Используем переданные данные или импортированные из модуля
  const mapsDataObj = passedMapsData || mapsData;
  
  if (!coordXInput || !coordYInput || !showCoordBtn) {
    return;
  }
  
  // Изначально скрываем кнопку "Показать"
  showCoordBtn.style.display = 'none';
  
  // Функция для проверки нужно ли показывать кнопку
  function checkShowButton() {
    // Показываем кнопку если хотя бы одно поле заполнено
    if (coordXInput.value.trim() !== '' || coordYInput.value.trim() !== '') {
      showCoordBtn.style.display = 'inline-block';
    } else {
      showCoordBtn.style.display = 'none';
    }
  }
  
  // Добавляем обработчики событий для полей ввода
  coordXInput.addEventListener('input', checkShowButton);
  coordYInput.addEventListener('input', checkShowButton);
  
  // Создаем контейнер для точек, если его нет
  const dotsLayer = document.getElementById('dots-layer');
  if (!dotsLayer) {
    const imageWrapper = document.getElementById('image-wrapper');
    if (!imageWrapper) {
      return;
    }
    
    // Создаем слой для точек
    const newDotsLayer = document.createElement('div');
    newDotsLayer.id = 'dots-layer';
    newDotsLayer.className = 'dots-layer';
    
    // Добавляем слой в контейнер карты
    imageWrapper.appendChild(newDotsLayer);
  }
  
  // Синхронизируем размер слоя точек с размером изображения
  syncDotsLayerSize('image');
  
  // Используем полученные данные карты или загружаем, если их нет
  if (mapData && title) {
    setupCoordinatesHandler(mapData, title, mapsDataObj);
  } else {
    // Загружаем данные карт если они не переданы
    loadMapData()
      .then(loadedMapData => {
        // Получаем название текущей карты из URL
        const urlParams = new URLSearchParams(window.location.search);
        const loadedTitle = urlParams.get('title') || '';
        
        setupCoordinatesHandler(loadedMapData, loadedTitle, mapsDataObj);
      })
      .catch(error => {
        showCoordsError('Не удалось загрузить данные карт');
      });
  }
  
  function setupCoordinatesHandler(mapData, title, mapsData) {
    const mapName = mapsData[title]?.name;
    
    // Добавляем обработчик для кнопки "Показать"
    showCoordBtn.addEventListener('click', () => {
      const x = parseFloat(coordXInput.value);
      const y = parseFloat(coordYInput.value);
      
      if (isNaN(x) || isNaN(y)) {
        showCoordsError('Введены некорректные координаты');
        return;
      }
      
      // Удаляем старую точку
      const oldDot = document.getElementById('custom-blue-dot');
      if (oldDot) oldDot.remove();
      
      // Проверяем, существует ли карта в данных
      if (!mapName) {
        showCoordsError('Не найдены данные о текущей карте');
        return;
      }
      
      // Находим информацию о карте
      const mapInfo = mapData.find(m => m.name === mapName);
      if (!mapInfo) {
        showCoordsError('Не найдена информация о карте');
        return;
      }
      
      // Проверяем наличие координат карты
      if (!mapInfo.game_coords) {
        showCoordsError('Карта не содержит информацию об игровых координатах');
        return;
      }
      
      // Проверяем, находятся ли координаты в пределах карты
      const { left_top, right_bottom } = mapInfo.game_coords;
      const minX = left_top[0];
      const maxX = right_bottom[0];
      const maxY = left_top[1];
      const minY = right_bottom[1];
      
      if (x < minX || x > maxX || y < minY || y > maxY) {
        showCoordsError('Таких координат на карте нет');
        return;
      }
      
      // Создаем точку на карте
      try {
        const coords = { x, y };
        
        // Используем стандартную функцию для рисования точки и модифицируем ее
        const dot = createCustomDot('image', coords, mapData, mapName);
        
        if (dot) {
          showCoordsSuccess(`Точка создана на координатах X${x}, Y${y}`);
          
          // Очищаем поля ввода и скрываем кнопку после успешного создания точки
          showCoordBtn.style.display = 'none';
        } else {
          throw new Error('Не удалось создать точку');
        }
      } catch (error) {
        showCoordsError('Не удалось создать точку на карте');
      }
    });
    
    // Обработчик нажатия Enter
    function handleEnterKey(e) {
      if (e.key === 'Enter') {
        showCoordBtn.click();
      }
    }
    
    coordXInput.addEventListener('keyup', handleEnterKey);
    coordYInput.addEventListener('keyup', handleEnterKey);
  }
}

// Функция для создания собственной точки
function createCustomDot(imageId, gameCoords, mapData, mapName) {
  const img = document.getElementById(imageId);
  const dotsLayer = document.getElementById('dots-layer');

  if (!img || !dotsLayer || !mapData) {
    return null;
  }

  // Находим информацию о карте
  const mapInfo = mapData.find(m => m.name === mapName);
  if (!mapInfo || !mapInfo.game_coords) {
    return null;
  }

  // Получаем размеры и координаты из данных карты
  const { left_top, right_bottom } = mapInfo.game_coords;
  const mapWidth = img.width;
  const mapHeight = img.height;

  const minX = left_top[0];
  const maxX = right_bottom[0];
  const maxY = left_top[1];
  const minY = right_bottom[1];

  // Рассчитываем позицию точки в пикселях
  const scaleX = mapWidth / (maxX - minX);
  const scaleY = mapHeight / (maxY - minY);
  const x_pixel = ((gameCoords.x) - minX) * scaleX;
  const y_pixel = mapHeight - ((gameCoords.y) - minY) * scaleY;
  
  // Создаем точку
  const circle = document.createElement('div');
  circle.id = 'custom-blue-dot'; // Уникальный ID для удаления
  circle.className = 'map-dot custom-blue-dot'; // Используем существующие стили
  circle.style.left = `${x_pixel}px`;
  circle.style.top = `${y_pixel}px`;
  
  // Добавляем атрибуты с координатами
  circle.dataset.coordX = gameCoords.x;
  circle.dataset.coordY = gameCoords.y;

  // Добавляем точку на слой
  dotsLayer.appendChild(circle);
  
  return circle;
}

// Функция для показа сообщения об ошибке
function showCoordsError(message) {
  let popup = document.getElementById('coords-error-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'coords-error-popup';
    popup.className = 'coords-error-popup';
    document.body.appendChild(popup);
  }
  // Скрываем popup успеха, если он есть
  const successPopup = document.getElementById('coords-success-popup');
  if (successPopup) successPopup.style.display = 'none';

  popup.textContent = message;
  popup.style.display = 'block';
  popup.style.zIndex = 2000;

  // Скрыть сообщение через 3 секунды
  clearTimeout(popup._hideTimeout);
  popup._hideTimeout = setTimeout(() => {
    popup.style.display = 'none';
  }, 3000);
}

// Функция для показа сообщения об успехе
function showCoordsSuccess(message) {
  let popup = document.getElementById('coords-success-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'coords-success-popup';
    popup.className = 'coords-success-popup';
    document.body.appendChild(popup);
  }
  // Скрываем popup ошибки, если он есть
  const errorPopup = document.getElementById('coords-error-popup');
  if (errorPopup) errorPopup.style.display = 'none';

  popup.textContent = message;
  popup.style.display = 'block';
  popup.style.zIndex = 2000;

  // Скрыть сообщение через 2 секунды
  clearTimeout(popup._hideTimeout);
  popup._hideTimeout = setTimeout(() => {
    popup.style.display = 'none';
  }, 2000);
}

// Инициализируем функционал ввода координат после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  setupCoordsInput();
});
