document.addEventListener('DOMContentLoaded', () => {
  // Імпортуємо дані карт та функції зуму
  import('../maps/mapsData.js').then(module => {
    import('../maps/mapZoom.js').then(zoomModule => {
      import('../maps/mapDataManager.js').then(async mapManagerModule => {
        const mapManager = mapManagerModule.default;
        
        // Додаємо функціонал для розкриття/згортання feachers-container
        initFeachersToggle();
        
        const mapsData = module.mapsData;
        window.mapsData = mapsData;
        
        // Ініціалізуємо менеджер даних карт
        try {
          const initialized = await mapManager.initialize();
          
          // Отримуємо поточні дані карти
          const currentMapKey = mapManager.getMapKeyFromUrl();
          const currentMapData = mapManager.getMapData();
          
          // Отримуємо розмір квадрата
          const squareSize = mapManager.getSquareSize();
          
          // Отримуємо посилання на зображення карти
          const imageElement = document.getElementById('image');
          
          // Чекаємо повного завантаження зображення перед ініціалізацією рулетки
          if (imageElement) {
            if (imageElement.complete) {
              // Якщо зображення вже завантажене
              initRuler(zoomModule, mapManager);
            } else {
              // Якщо зображення ще завантажується, чекаємо події load
              imageElement.addEventListener('load', () => {
                // Даємо невелику затримку для завершення будь-яких CSS трансформацій
                setTimeout(() => {
                  initRuler(zoomModule, mapManager);
                }, 100);
              });
            }
          }
        } catch (error) {
          // Не виводимо помилку
        }
      });
    });
  });
});

// Функція для ініціалізації перемикання відображення feachers-container
function initFeachersToggle() {
  const arrowElement = document.querySelector('.ruler-feacher-arrow');
  const feachersContainer = document.getElementById('feachers-container');
 
  // Початково приховуємо контейнер
  if (feachersContainer) {
    feachersContainer.style.display = 'none';
  }
 
  // Додаємо обробник кліку по стрілці
  if (arrowElement) {
    arrowElement.addEventListener('click', () => {
      // Перемикаємо відображення контейнера
      if (feachersContainer) {
        if (feachersContainer.style.display === 'none') {
          feachersContainer.style.display = 'flex';
          // Обертаємо стрілку на 180 градусів
          arrowElement.style.transform = 'rotate(180deg)';
        } else {
          feachersContainer.style.display = 'none';
          // Повертаємо стрілку у початкове положення
          arrowElement.style.transform = 'rotate(0deg)';
        }
      }
    });
   
    // Додаємо стиль для плавного повороту стрілки
    arrowElement.style.transition = 'transform 0.3s ease';
  }
}

// Функція ініціалізації рулетки
function initRuler(zoomModule, mapManager) {
  let rulerActive = false;
  let firstPoint = null;
  let secondPoint = null;
  let tempLine = null;
  let distanceLabel = null;
  let mouseMoveListener = null;
  let measurementComplete = false; // Флаг завершення вимірювання (після розміщення другої точки)
  let isDragging = false; // Флаг для відстеження перетягування карти
 
  // Знаходимо елементи для роботи
  const imageWrapper = document.getElementById('image-wrapper');
  const zoomContainer = document.getElementById('zoom-container');
  const imageElement = document.getElementById('image');
  const rulerSwitch = document.querySelector('input[type="checkbox"][id^="ruler"]'); // Припускаємо, що перемикач має id, що починається з "ruler"
 
  if (!imageWrapper || !zoomContainer || !imageElement || !rulerSwitch) {
    return;
  }
 
  // Розрахунок реальних метрів на основі пікселів
  function calculateRealDistance(x1, y1, x2, y2) {
    // Отримуємо поточний зум контейнера
    const currentZoom = zoomModule.getCurrentZoom();
    
    // Перевіряємо назву поточної карти
    const urlParams = new URLSearchParams(window.location.search);
    const mapKey = urlParams.get('title') || '';
    
    if (mapKey === 'sura') {
      const squareSize = 78; // Примусово використовуємо правильний розмір для річки Сура
      
      // Розрахунок відстані в пікселях
      const pixelDistance = Math.sqrt(
        Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2)
      );
      
      // Розміри зображення
      const rect = imageElement.getBoundingClientRect();
      
      // Розраховуємо пропорційний відступ
      const originalSize = 1944;
      const originalBorderOffset = 78;
      const borderOffset = originalBorderOffset * (rect.width / originalSize / currentZoom);
      
      // Коригуємо координати з урахуванням відступу
      const adjustedX1 = x1 - borderOffset;
      const adjustedY1 = y1 - borderOffset;
      const adjustedX2 = x2 - borderOffset;
      const adjustedY2 = y2 - borderOffset;
      
      // Скоригована відстань в пікселях
      const adjustedPixelDistance = Math.sqrt(
        Math.pow(adjustedX2 - adjustedX1, 2) +
        Math.pow(adjustedY2 - adjustedY1, 2)
      );
      
      // Ефективний розмір карти в пікселях
      const effectiveMapSize = rect.width / currentZoom - (borderOffset * 2);
      
      // Розмір одного квадрата в пікселях (карта 10x10 квадратів)
      const pixelsPerSquare = effectiveMapSize / 10;
      
      // Коефіцієнт перетворення пікселів в метри
      const metersPerPixel = squareSize / pixelsPerSquare;
      
      // Відстань в метрах
      const distanceInMeters = adjustedPixelDistance * metersPerPixel;
      
      return Math.round(distanceInMeters);
    }
    
    // Для інших карт використовуємо менеджер даних карт
    // Розрахунок відстані в пікселях
    const pixelDistance = Math.sqrt(
      Math.pow(x2 - x1, 2) +
      Math.pow(y2 - y1, 2)
    );
    
    // Розміри зображення
    const rect = imageElement.getBoundingClientRect();
    
    // Розраховуємо пропорційний відступ (78px на оригінальній карті 1944px)
    const originalSize = 1944;
    const originalBorderOffset = 78;
    const borderOffset = originalBorderOffset * (rect.width / originalSize / currentZoom);
    
    // Коригуємо координати з урахуванням відступу
    const adjustedX1 = x1 - borderOffset;
    const adjustedY1 = y1 - borderOffset;
    const adjustedX2 = x2 - borderOffset;
    const adjustedY2 = y2 - borderOffset;
    
    // Скоригована відстань в пікселях
    const adjustedPixelDistance = Math.sqrt(
      Math.pow(adjustedX2 - adjustedX1, 2) +
      Math.pow(adjustedY2 - adjustedY1, 2)
    );
    
    // Отримуємо розмір квадрата в метрах з менеджера даних карт
    const squareSize = mapManager.getSquareSize();
    
    // Ефективний розмір карти в пікселях
    const effectiveMapSize = rect.width / currentZoom - (borderOffset * 2);
    
    // Розмір одного квадрата в пікселях (карта 10x10 квадратів)
    const pixelsPerSquare = effectiveMapSize / 10;
    
    // Коефіцієнт перетворення пікселів в метри
    const metersPerPixel = squareSize / pixelsPerSquare;
    
    // Відстань в метрах
    const distanceInMeters = adjustedPixelDistance * metersPerPixel;
    
    return Math.round(distanceInMeters);
  }
 
  // Функція для отримання координат точки відносно оригінального зображення
  function getOriginalImageCoordinates(clientX, clientY) {
    const rect = imageElement.getBoundingClientRect();
    const currentZoom = zoomModule.getCurrentZoom();
   
    // Позиція кліка відносно зображення з врахуванням зуму
    const imageX = (clientX - rect.left) / currentZoom;
    const imageY = (clientY - rect.top) / currentZoom;
   
    return { x: imageX, y: imageY };
  }
 
  // Створення точки на карті
  function createPoint(x, y) {
    const point = document.createElement('div');
    point.className = 'ruler-circle';
   
    // Встановлюємо позицію відносно оригінального зображення
    point.style.left = `${x}px`;
    point.style.top = `${y}px`;
   
    // Зберігаємо оригінальні координати в атрибутах для правильного масштабування
    point.setAttribute('data-x', x);
    point.setAttribute('data-y', y);
   
    zoomContainer.appendChild(point);
    return point;
  }
 
  // Оновлення лінії між точками
  function updateLine(x1, y1, x2, y2) {
    if (!tempLine) {
      tempLine = document.createElement('div');
      tempLine.className = 'ruler-line';
      zoomContainer.appendChild(tempLine);
    }
   
    // Розрахунок довжини та кута лінії
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
   
    // Встановлюємо позицію та розмір лінії
    tempLine.style.width = `${length}px`;
    tempLine.style.left = `${x1}px`;
    tempLine.style.top = `${y1}px`;
    tempLine.style.transform = `rotate(${angle}deg)`;
    tempLine.style.transformOrigin = 'left center';
   
    // Зберігаємо оригінальні координати в атрибутах для оновлення при зумі
    tempLine.setAttribute('data-x1', x1);
    tempLine.setAttribute('data-y1', y1);
    tempLine.setAttribute('data-x2', x2);
    tempLine.setAttribute('data-y2', y2);
    tempLine.setAttribute('data-length', length);
    tempLine.setAttribute('data-angle', angle);
  }
 
  // Оновлення мітки з відстанню
  function updateDistanceLabel(x1, y1, x2, y2, distance) {
    if (!distanceLabel) {
      distanceLabel = document.createElement('div');
      distanceLabel.className = 'ruler-distance-label';
      zoomContainer.appendChild(distanceLabel);
    }
   
    // Розміщуємо мітку посередині відрізка
    let midX = (x1 + x2) / 2;
    let midY = (y1 + y2) / 2;
   
    // Перевірка, чи достатньо місця для мітки між точками
    const minDistanceForLabel = 70; // мінімальна відстань для розміщення мітки між точками
    const distance_px = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
   
    if (distance_px < minDistanceForLabel) {
      // Якщо відстань замала, розміщуємо мітку над другою точкою
      midX = x2;
      midY = y2 - 20; // зміщення вгору від точки
    }
   
    distanceLabel.style.left = `${midX}px`;
    distanceLabel.style.top = `${midY}px`;
    distanceLabel.textContent = `${distance} м`;
   
    // Зберігаємо оригінальні координати в атрибутах для оновлення при зумі
    distanceLabel.setAttribute('data-x1', x1);
    distanceLabel.setAttribute('data-y1', y1);
    distanceLabel.setAttribute('data-x2', x2);
    distanceLabel.setAttribute('data-y2', y2);
    distanceLabel.setAttribute('data-midx', midX);
    distanceLabel.setAttribute('data-midy', midY);
  }
 
  // Очищення елементів рулетки
  function clearRulerElements() {
    if (firstPoint) {
      zoomContainer.removeChild(firstPoint);
      firstPoint = null;
    }
   
    if (secondPoint) {
      zoomContainer.removeChild(secondPoint);
      secondPoint = null;
    }
   
    if (tempLine) {
      zoomContainer.removeChild(tempLine);
      tempLine = null;
    }
   
    if (distanceLabel) {
      zoomContainer.removeChild(distanceLabel);
      distanceLabel = null;
    }
   
    if (mouseMoveListener) {
      document.removeEventListener('mousemove', mouseMoveListener);
      mouseMoveListener = null;
    }
   
    // Скидаємо прапорець завершеного вимірювання
    measurementComplete = false;
  }
 
  // Обробник зміни стану перемикача рулетки
  rulerSwitch.addEventListener('change', function() {
    const newState = this.checked;
   
    // Якщо вимикаємо рулетку, очищуємо елементи
    if (rulerActive && !newState) {
      clearRulerElements();
    }
   
    rulerActive = newState;
  });
 
  // Перевірка можливості розміщення точки (чи немає елементів з вищим z-index)
  function canPlacePoint(clientX, clientY) {
    // Отримуємо всі елементи під точкою кліку
    const elements = document.elementsFromPoint(clientX, clientY);
    
    if (elements.length === 0) return true;
    
    // Отримуємо z-index зум-контейнера (або його значення за замовчуванням)
    const zoomContainerZIndex = parseInt(window.getComputedStyle(zoomContainer).zIndex) || 0;
    
    // Перевіряємо, чи є елементи з вищим z-index, ніж зум-контейнер
    for (const element of elements) {
      // Пропускаємо елементи рулетки
      if (element.classList.contains('ruler-circle') || 
          element.classList.contains('ruler-line') || 
          element.classList.contains('ruler-distance-label')) {
        continue;
      }
      
      // Отримуємо z-index елемента
      const elementZIndex = parseInt(window.getComputedStyle(element).zIndex) || 0;
      
      // Якщо елемент має вищий z-index, ніж зум-контейнер, не дозволяємо розміщення
      if (elementZIndex > zoomContainerZIndex) {
        return false;
      }
    }
    
    return true;
  }
 
  // Додаємо обробники для відстеження перетягування карти
  imageWrapper.addEventListener('mousedown', function(e) {
    // Запам'ятовуємо початкову позицію для визначення перетягування
    const startX = e.clientX;
    const startY = e.clientY;
    const dragThreshold = 5; // Мінімальна відстань для визначення перетягування
    let hasMoved = false;
    
    const mouseMoveHandler = function(moveEvent) {
      // Перевіряємо, чи відбулося перетягування більше ніж на певну відстань
      const deltaX = Math.abs(moveEvent.clientX - startX);
      const deltaY = Math.abs(moveEvent.clientY - startY);
      
      if (deltaX > dragThreshold || deltaY > dragThreshold) {
        isDragging = true;
        hasMoved = true;
      }
    };
    
    const mouseUpHandler = function() {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      
      // Скидаємо флаг перетягування через невелику затримку,
      // щоб клік після відпускання не створив точку
      if (hasMoved) {
        setTimeout(function() {
          isDragging = false;
        }, 50);
      } else {
        isDragging = false;
      }
    };
    
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
 
  // Обробник кліку по карті
  imageWrapper.addEventListener('click', function(e) {
    if (!rulerActive) return;
   
    // Запобігаємо обробці, якщо клік правою кнопкою
    if (e.button === 2) return;
   
    // Не робимо нічого, якщо вимірювання вже завершено (є дві точки)
    if (measurementComplete) return;
    
    // Не робимо нічого, якщо відбувається перетягування
    if (isDragging) {
      return;
    }
    
    // Перевіряємо, чи можна розмістити точку на елементі під курсором
    if (!canPlacePoint(e.clientX, e.clientY)) {
      return;
    }
   
    // Отримуємо координати кліка відносно оригінального зображення
    const coords = getOriginalImageCoordinates(e.clientX, e.clientY);
   
    if (!firstPoint) {
      // Створюємо першу точку
      firstPoint = createPoint(coords.x, coords.y);
     
      // Додаємо обробник руху миші для відображення тимчасової лінії
      mouseMoveListener = function(moveEvent) {
        if (!firstPoint) return;
       
        const moveCoords = getOriginalImageCoordinates(moveEvent.clientX, moveEvent.clientY);
       
        // Оновлюємо лінію та відстань
        updateLine(coords.x, coords.y, moveCoords.x, moveCoords.y);
       
        const distance = calculateRealDistance(coords.x, coords.y, moveCoords.x, moveCoords.y);
        updateDistanceLabel(coords.x, coords.y, moveCoords.x, moveCoords.y, distance);
      };
     
      document.addEventListener('mousemove', mouseMoveListener);
    } else if (!secondPoint) {
      // Створюємо другу точку
      secondPoint = createPoint(coords.x, coords.y);
     
      // Оновлюємо лінію та відстань
      const x1 = parseFloat(firstPoint.getAttribute('data-x'));
      const y1 = parseFloat(firstPoint.getAttribute('data-y'));
     
      updateLine(x1, y1, coords.x, coords.y);
     
      const distance = calculateRealDistance(x1, y1, coords.x, coords.y);
      updateDistanceLabel(x1, y1, coords.x, coords.y, distance);
     
      // Видаляємо обробник руху миші - більше не потрібен
      document.removeEventListener('mousemove', mouseMoveListener);
      mouseMoveListener = null;
     
      // Встановлюємо прапорець завершеного вимірювання
      measurementComplete = true;
    }
  });
 
  // Обробник правого кліку для скасування
  imageWrapper.addEventListener('contextmenu', function(e) {
    if (!rulerActive) return;
   
    e.preventDefault(); // Запобігаємо відкриттю контекстного меню
    clearRulerElements(); // Очищуємо всі елементи рулетки
  });
 
  // Оновлення позиції елементів при зміні зуму або переміщенні карти
  function updateElementsPosition() {
    if (!rulerActive) return;
   
    const currentZoom = zoomModule.getCurrentZoom();
   
    // Оновлюємо позицію першої точки
    if (firstPoint) {
      const x1 = parseFloat(firstPoint.getAttribute('data-x'));
      const y1 = parseFloat(firstPoint.getAttribute('data-y'));
     
      // Не змінюємо розмір точок при зумі, зберігаємо тільки центрування
      firstPoint.style.transform = `translate(-50%, -50%)`;
    }
   
    // Оновлюємо позицію другої точки
    if (secondPoint) {
      const x2 = parseFloat(secondPoint.getAttribute('data-x'));
      const y2 = parseFloat(secondPoint.getAttribute('data-y'));
     
      // Не змінюємо розмір точок при зумі, зберігаємо тільки центрування
      secondPoint.style.transform = `translate(-50%, -50%)`;
    }
   
    // Оновлюємо лінію та мітку, якщо є обидві точки
    if (firstPoint && secondPoint && tempLine && distanceLabel) {
      const x1 = parseFloat(firstPoint.getAttribute('data-x'));
      const y1 = parseFloat(firstPoint.getAttribute('data-y'));
      const x2 = parseFloat(secondPoint.getAttribute('data-x'));
      const y2 = parseFloat(secondPoint.getAttribute('data-y'));
     
      // Перераховуємо відстань та оновлюємо мітку
      const distance = calculateRealDistance(x1, y1, x2, y2);
     
      // Оновлюємо відстань на мітці
      distanceLabel.textContent = `${distance} м`;
    }
  }
 
  // Зберігаємо останню позицію миші
  let lastMousePosition = { x: 0, y: 0 };
  document.addEventListener('mousemove', function(e) {
    lastMousePosition.x = e.clientX;
    lastMousePosition.y = e.clientY;
  });
 
  // Підписуємося на зміни зуму
  document.addEventListener('zoomChange', updateElementsPosition);
  
  // Додаємо обробник для примусового оновлення після зміни зуму
  if (zoomContainer) {
    zoomContainer.addEventListener('zoomTransformApplied', updateElementsPosition);
  }
}