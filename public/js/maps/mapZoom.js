let zoom = 1; // Начальный зум при загрузке страницы
const minZoom = 1; // scale = 1 — это минимальный масштаб
const maxZoom = 3;

let translate = { x: 0, y: 0 };

export function getCurrentZoom() {
  return zoom;
}

export function getLastTranslate() {
  return { ...translate };
}

export function setLastTranslate(tr) {
  translate = { ...tr };
  applyTransform();
}

export function applyTransform() {
    const container = document.getElementById('zoom-container');
    if (!container) {
      return;
    }
    
    if (zoom === 1) {
      // При зуме 1 не применяем scale вообще
      container.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
    } else {
      container.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`;
    }
    
    // Отправляем событие о применении трансформации, чтобы другие модули могли реагировать
    const event = new CustomEvent('zoomTransformApplied', { 
      detail: { zoom, translate: {...translate} }
    });
    container.dispatchEvent(event);
    
    // Также отправляем глобальное событие для документа
    document.dispatchEvent(new CustomEvent('zoomChange', {
      detail: { zoom, translate: {...translate} }
    }));
  }

  // Модифицированная функция для обеспечения центрирования при загрузке
  export function initZoom(wrapperId = 'image-wrapper', containerId = 'zoom-container') {
    const wrapper = document.getElementById(wrapperId);
    const container = document.getElementById(containerId);
    const img = document.getElementById('image');
    
    if (!wrapper || !container || !img) {
      return;
    }
    
    // Функция для центрирования с помощью трансформации, без позиционирования
    function centerWithTransform() {
      // Сбрасываем трансформацию, чтобы получить правильные размеры
      container.style.transform = '';
      
      // Получаем размеры элементов
      const wrapperRect = wrapper.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      
      // Рассчитываем новую позицию для центрирования
      translate.x = (wrapperRect.width - imgRect.width) / 2;
      translate.y = (wrapperRect.height - imgRect.height) / 2;
      
      // Сбрасываем масштаб
      zoom = 1;
      
      // Применяем трансформацию
      applyTransform();
    }
    
    // Применяем центрирование после загрузки
    if (img.complete) {
      centerWithTransform();
    } else {
      img.onload = centerWithTransform;
    }
    
    // Добавляем слушатель для изменения размера окна
    window.addEventListener('resize', centerWithTransform);
    
    // Обработчик для колеса мыши (зум)
    wrapper.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      // Получаем текущие позиции
      const containerRect = container.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      
      // Определяем позицию мыши относительно контейнера
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;
      
      // Сохраняем текущий масштаб
      const prevZoom = zoom;
      
      // Изменяем масштаб
      const zoomFactor = 1.1;
      zoom *= e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
      zoom = Math.max(minZoom, Math.min(maxZoom, zoom));
      
      // Если мы на минимальном зуме, просто центрируем
      if (zoom === minZoom) {
        centerWithTransform();
      } else {
        // Пересчитываем трансформацию
        translate.x = translate.x - mouseX * (zoom / prevZoom - 1);
        translate.y = translate.y - mouseY * (zoom / prevZoom - 1);
        
        // Проверяем и ограничиваем новые координаты, чтобы они не выходили за пределы родительского блока
        const constrainedTranslate = clampTranslateZoom(translate, zoom, container, wrapper);
        translate = constrainedTranslate;
        
        applyTransform();
      }
    }, { passive: false });
  }

  // Новая функция для ограничения координат при зуме
  function clampTranslateZoom(translate, zoom, container, wrapper) {
    if (!container || !wrapper) {
      return translate;
    }
    
    // Сохраняем оригинальную трансформацию
    const originalTransform = container.style.transform;
    
    // Временно применяем только масштаб
    container.style.transform = `scale(${zoom})`;
    const containerRect = container.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    
    // Восстанавливаем оригинальную трансформацию
    container.style.transform = originalTransform;
    
    let clampedTranslate = { ...translate };
    
    // Горизонтальные ограничения
    if (containerRect.width <= wrapperRect.width) {
      // Если контейнер уже wrapper - центрируем
      clampedTranslate.x = (wrapperRect.width - containerRect.width) / 2;
    } else {
      // Если контейнер шире - ограничиваем границами
      const minX = wrapperRect.width - containerRect.width;
      const maxX = 0;
      clampedTranslate.x = Math.min(maxX, Math.max(minX, clampedTranslate.x));
    }
    
    // Вертикальные ограничения
    if (containerRect.height <= wrapperRect.height) {
      // Если контейнер ниже wrapper - центрируем
      clampedTranslate.y = (wrapperRect.height - containerRect.height) / 2;
    } else {
      // Если контейнер выше - ограничиваем границами
      const minY = wrapperRect.height - containerRect.height;
      const maxY = 0;
      clampedTranslate.y = Math.min(maxY, Math.max(minY, clampedTranslate.y));
    }
    
    return clampedTranslate;
  }

  export function clampTranslate(translate, zoom, container, wrapper) {
    return clampTranslateZoom(translate, zoom, container, wrapper);
  }

export function centerZoomContainer() {
    const wrapper = document.getElementById('image-wrapper');
    const container = document.getElementById('zoom-container');
    
    if (!wrapper || !container) {
      return;
    }
    
    // Сохраняем оригинальную трансформацию
    const originalTransform = container.style.transform;
    
    // Применяем только масштаб, чтобы получить правильные размеры
    container.style.transform = `scale(${zoom})`;
    const containerRect = container.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    
    // Восстанавливаем трансформацию
    container.style.transform = originalTransform;
    
    // Рассчитываем центрирование
    translate.x = (wrapperRect.width - containerRect.width) / 2;
    translate.y = (wrapperRect.height - containerRect.height) / 2;
    
    applyTransform();
  }

  export function forceInitialCentering() {
    const wrapper = document.getElementById('image-wrapper');
    const container = document.getElementById('zoom-container');
    const img = document.getElementById('image');
    
    if (!wrapper || !container || !img) {
      return;
    }
    
    // Полностью сбрасываем трансформацию для правильного вычисления
    container.style.transform = '';
    translate = { x: 0, y: 0 };
    zoom = 1;
    
    // Выполняем центрирование с небольшой задержкой
    setTimeout(() => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      
      // Вычисляем translate для центрирования
      translate.x = (wrapperRect.width - imgRect.width) / 2;
      translate.y = (wrapperRect.height - imgRect.height) / 2;
      
      // Применяем трансформацию
      applyTransform();
    }, 50);
  }

    // Инициализация при загрузке страницы
    document.addEventListener('DOMContentLoaded', () => {
    // Добавляем задержку перед инициализацией
    setTimeout(() => {
      initZoom();
    }, 200);
    
    // Дополнительное центрирование после полной загрузки страницы
    window.addEventListener('load', () => {
      setTimeout(() => {
        const container = document.getElementById('zoom-container');
        
        // Сначала удаляем все трансформации
        container.style.transform = '';
        
        // Затем инициализируем снова
        initZoom();
      }, 500);
    });
  });