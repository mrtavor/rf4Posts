import {
    getCurrentZoom,
    getLastTranslate,
    setLastTranslate,
    applyTransform,
    centerZoomContainer
  } from './mapZoom.js';
  
  export function initDrag() {
    const container = document.getElementById('zoom-container');
    const wrapper = document.getElementById('image-wrapper');
    const img = document.getElementById('image');
    
    if (!container || !wrapper || !img) {
      console.error('Не вдалося знайти необхідні елементи для ініціалізації драгу');
      return;
    }
    
    // Встановлюємо курсор для контейнера
    container.style.cursor = 'default';
    
    // Змінні для відстеження стану перетягування
    let isDragging = false;
    let startX, startY;
    let startTranslate;
    
    // Обробник для початку перетягування
    function onPointerDown(e) {
      // Перевіряємо, що це ліва кнопка миші
      if (e.button !== 0) return;
      
      // Перевіряємо масштаб
      const zoom = getCurrentZoom();
      if (zoom <= 1) {
        return;
      }
      
      // Запам'ятовуємо початкові координати
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startTranslate = getLastTranslate();
      
      // Встановлюємо стиль курсора і захоплення
      container.setPointerCapture(e.pointerId);
      container.style.cursor = 'default';
      // Додаємо клас для CSS-стилізації
      container.classList.add('dragging');
      // Додаємо клас до body, щоб встановити правильний курсор
      document.body.classList.add('map-dragging');
      document.body.style.userSelect = 'none';
      e.preventDefault();
    }
    
    // Обробник для перетягування
    function onPointerMove(e) {
      if (!isDragging) return;
      
      // Обчислюємо зміщення
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      // Створюємо нове зміщення
      const newTranslate = {
        x: startTranslate.x + dx,
        y: startTranslate.y + dy
      };
      
      // Отримуємо поточний масштаб
      const zoom = getCurrentZoom();
      
      // Отримуємо розміри wrapper
      const wrapperRect = wrapper.getBoundingClientRect();
      
      // ВАЖЛИВО: отримуємо візуальні розміри контейнера ПІСЛЯ масштабування
      // Для цього тимчасово скидаємо translate, щоб отримати тільки розміри з урахуванням scale
      const originalTransform = container.style.transform;
      container.style.transform = `scale(${zoom})`;
      const containerRect = container.getBoundingClientRect();
      container.style.transform = originalTransform;
      
      // Обчислюємо обмеження
      let limitedTranslate = { ...newTranslate };
      
      // Горизонтальні обмеження
      if (containerRect.width <= wrapperRect.width) {
        // Контейнер вміщується в wrapper - центруємо
        limitedTranslate.x = (wrapperRect.width - containerRect.width) / 2;
      } else {
        // Контейнер ширший за wrapper - обмежуємо
        const minX = wrapperRect.width - containerRect.width; // Правий край контейнера не виходить за правий край wrapper
        const maxX = 0; // Лівий край контейнера не виходить за лівий край wrapper
        
        limitedTranslate.x = Math.min(maxX, Math.max(minX, limitedTranslate.x));
      }
      
      // Вертикальні обмеження
      if (containerRect.height <= wrapperRect.height) {
        // Контейнер вміщується у wrapper - центруємо
        limitedTranslate.y = (wrapperRect.height - containerRect.height) / 2;
      } else {
        // Контейнер вищий за wrapper - обмежуємо
        const minY = wrapperRect.height - containerRect.height; // Нижній край контейнера не виходить за нижній край wrapper
        const maxY = 0; // Верхній край контейнера не виходить за верхній край wrapper
        
        limitedTranslate.y = Math.min(maxY, Math.max(minY, limitedTranslate.y));
      }
      
      // Застосовуємо нове зміщення
      setLastTranslate(limitedTranslate);
      applyTransform();
    }
    
    // Обробник для завершення перетягування
    function onPointerUp(e) {
      if (!isDragging) return;
      
      isDragging = false;
      container.releasePointerCapture(e.pointerId);
      container.style.cursor = 'default';
      // Видаляємо клас dragging
      container.classList.remove('dragging');
      // Видаляємо клас з body
      document.body.classList.remove('map-dragging');
      document.body.style.userSelect = '';
    }
    
    // Видаляємо попередні обробники, якщо такі є
    container.removeEventListener('pointerdown', onPointerDown);
    container.removeEventListener('pointermove', onPointerMove);
    container.removeEventListener('pointerup', onPointerUp);
    container.removeEventListener('pointercancel', onPointerUp);
    container.removeEventListener('pointerleave', onPointerUp);
    
    // Додаємо обробники подій
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('pointerleave', onPointerUp);
    
    return true;
  }
