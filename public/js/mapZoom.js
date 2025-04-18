let zoom = 1; // Початковий зум при загрузці сторінки
const minZoom = 1; // scale = 1 — це мінімальний масштаб
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
      console.error('Елемент zoom-container не знайдено');
      return;
    }
    
    if (zoom === 1) {
      // При зумі 1 не застосовуємо scale взагалі
      container.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
    } else {
      container.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`;
    }
  }

  // Модифікована функція для забезпечення центрування при завантаженні
  export function initZoom(wrapperId = 'image-wrapper', containerId = 'zoom-container') {
    const wrapper = document.getElementById(wrapperId);
    const container = document.getElementById(containerId);
    const img = document.getElementById('image');
    
    if (!wrapper || !container || !img) {
      console.error('Не вдалося знайти необхідні елементи для ініціалізації зуму');
      return;
    }
    
    // Функція для центрування за допомогою трансформації, без позиціонування
    function centerWithTransform() {
      // Скидаємо трансформацію, щоб отримати правильні розміри
      container.style.transform = '';
      
      // Отримуємо розміри елементів
      const wrapperRect = wrapper.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      
      // Розраховуємо нову позицію для центрування
      translate.x = (wrapperRect.width - imgRect.width) / 2;
      translate.y = (wrapperRect.height - imgRect.height) / 2;
      
      // Скидаємо масштаб
      zoom = 1;
      
      // Застосовуємо трансформацію
      applyTransform();
    }
    
    // Застосовуємо центрування після завантаження
    if (img.complete) {
      centerWithTransform();
    } else {
      img.onload = centerWithTransform;
    }
    
    // Додаємо прослуховувач для зміни розміру вікна
    window.addEventListener('resize', centerWithTransform);
    
    // Обробник для колеса миші (зум)
    wrapper.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      // Отримуємо поточні позиції
      const containerRect = container.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      
      // Визначаємо позицію миші відносно контейнера
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;
      
      // Зберігаємо поточний масштаб
      const prevZoom = zoom;
      
      // Змінюємо масштаб
      const zoomFactor = 1.1;
      zoom *= e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
      zoom = Math.max(minZoom, Math.min(maxZoom, zoom));
      
      // Якщо ми на мінімальному зумі, просто центруємо
      if (zoom === minZoom) {
        centerWithTransform();
      } else {
        // Перераховуємо трансформацію
        translate.x = translate.x - mouseX * (zoom / prevZoom - 1);
        translate.y = translate.y - mouseY * (zoom / prevZoom - 1);
        
        // Перевіряємо і обмежуємо нові координати, щоб вони не виходили за межі батьківського блоку
        const constrainedTranslate = clampTranslateZoom(translate, zoom, container, wrapper);
        translate = constrainedTranslate;
        
        applyTransform();
      }
    }, { passive: false });
  }

  // Нова функція для обмеження координат при зумі
  function clampTranslateZoom(translate, zoom, container, wrapper) {
    if (!container || !wrapper) {
      return translate;
    }
    
    // Зберігаємо оригінальну трансформацію
    const originalTransform = container.style.transform;
    
    // Тимчасово застосовуємо тільки масштаб
    container.style.transform = `scale(${zoom})`;
    const containerRect = container.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    
    // Відновлюємо оригінальну трансформацію
    container.style.transform = originalTransform;
    
    let clampedTranslate = { ...translate };
    
    // Горизонтальні обмеження
    if (containerRect.width <= wrapperRect.width) {
      // Якщо контейнер вужчий за wrapper - центруємо
      clampedTranslate.x = (wrapperRect.width - containerRect.width) / 2;
    } else {
      // Якщо контейнер ширший - обмежуємо границями
      const minX = wrapperRect.width - containerRect.width;
      const maxX = 0;
      clampedTranslate.x = Math.min(maxX, Math.max(minX, clampedTranslate.x));
    }
    
    // Вертикальні обмеження
    if (containerRect.height <= wrapperRect.height) {
      // Якщо контейнер нижчий за wrapper - центруємо
      clampedTranslate.y = (wrapperRect.height - containerRect.height) / 2;
    } else {
      // Якщо контейнер вищий - обмежуємо границями
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
      console.error('Не вдалося знайти необхідні елементи для центрування');
      return;
    }
    
    // Зберігаємо оригінальну трансформацію
    const originalTransform = container.style.transform;
    
    // Застосовуємо тільки масштаб, щоб отримати правильні розміри
    container.style.transform = `scale(${zoom})`;
    const containerRect = container.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    
    // Відновлюємо трансформацію
    container.style.transform = originalTransform;
    
    // Розраховуємо центрування
    translate.x = (wrapperRect.width - containerRect.width) / 2;
    translate.y = (wrapperRect.height - containerRect.height) / 2;
    
    applyTransform();
  }

  export function forceInitialCentering() {
    const wrapper = document.getElementById('image-wrapper');
    const container = document.getElementById('zoom-container');
    const img = document.getElementById('image');
    
    if (!wrapper || !container || !img) {
      console.error('Не вдалося знайти необхідні елементи для центрування');
      return;
    }
    
    // Повністю скидаємо трансформацію для правильного обчислення
    container.style.transform = '';
    translate = { x: 0, y: 0 };
    zoom = 1;
    
    // Виконуємо центрування з невеликою затримкою
    setTimeout(() => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      
      // Обчислюємо translate для центрування
      translate.x = (wrapperRect.width - imgRect.width) / 2;
      translate.y = (wrapperRect.height - imgRect.height) / 2;
      
      // Застосовуємо трансформацію
      applyTransform();
    }, 50);
  }

    // Ініціалізація при завантаженні сторінки
    document.addEventListener('DOMContentLoaded', () => {
    // Додаємо затримку перед ініціалізацією
    setTimeout(() => {
      initZoom();
    }, 200);
    
    // Додаткове центрування після повного завантаження сторінки
    window.addEventListener('load', () => {
      setTimeout(() => {
        const container = document.getElementById('zoom-container');
        
        // Спочатку видаляємо всі трансформації
        container.style.transform = '';
        
        // Потім ініціалізуємо знову
        initZoom();
      }, 500);
    });
  });