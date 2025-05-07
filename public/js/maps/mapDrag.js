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
      console.error('Не удалось найти необходимые элементы для инициализации драга');
      return;
    }
    
    // Устанавливаем курсор для контейнера
    container.style.cursor = 'default';
    
    // Переменные для отслеживания состояния перетаскивания
    let isDragging = false;
    let startX, startY;
    let startTranslate;
    let mouseDown = false;
    
    // Функция для проверки, обрабатывается ли элемент линейки
    function isRulerElement(element) {
      return element.hasAttribute('data-ruler-element') || 
             element.classList.contains('ruler-circle') || 
             element.classList.contains('ruler-line') || 
             element.classList.contains('ruler-distance-label');
    }
    
    // Функция для проверки активности линейки
    function isRulerActive() {
      // Не блокируем перетаскивание даже если линейка активна
      return false;
    }
    
    // Функция обновления курсора в соответствии с зумом
    function updateCursor() {
      const zoom = getCurrentZoom();
      
      // Если линейка активна, не меняем курсор
      if (isRulerActive()) {
        return;
      }
      
      if (zoom > 1) {
        if (isDragging) {
          container.style.cursor = 'grabbing';
        } else {
          container.style.cursor = 'grab';
        }
      } else {
        container.style.cursor = 'default';
      }
    }
    
    // Обработчик для начала перетаскивания
    function onPointerDown(e) {
      // Проверяем, что это левая кнопка мыши
      if (e.button !== 0) return;
      
      // Если линейка активна или клик на элементе линейки, не обрабатываем его
      if (isRulerActive() || isRulerElement(e.target)) {
        return;
      }
      
      // Проверяем масштаб
      const zoom = getCurrentZoom();
      if (zoom <= 1) {
        container.style.cursor = 'default';
        return;
      }
      
      // Запоминаем начальные координаты
      startX = e.clientX;
      startY = e.clientY;
      startTranslate = getLastTranslate();
      
      // Устанавливаем состояние перетаскивания
      isDragging = true;
      container.setPointerCapture(e.pointerId);
      container.style.cursor = 'grabbing';
      
      // Добавляем класс для CSS-стилизации
      container.classList.add('dragging');
      
      // Добавляем класс к body, чтобы установить правильный курсор
      document.body.classList.add('map-dragging');
      document.body.style.userSelect = 'none';
    }
    
    // Обработчик для перетаскивания
    function onPointerMove(e) {
      if (!isDragging) {
        // Если не перетаскиваем, но курсор над контейнером,
        // обновляем курсор в соответствии с зумом (только если линейка неактивна)
        if (!isRulerActive()) {
          const zoom = getCurrentZoom();
          if (zoom > 1) {
            container.style.cursor = 'grab';
          }
        }
        return;
      }
      
      // Изменение курсора на граббинг
      container.style.cursor = 'grabbing';
      
      // Вычисляем смещение
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      // Создаем новое смещение
      const newTranslate = {
        x: startTranslate.x + dx,
        y: startTranslate.y + dy
      };
      
      // Получаем текущий масштаб
      const zoom = getCurrentZoom();
      
      // Получаем размеры wrapper
      const wrapperRect = wrapper.getBoundingClientRect();
      
      // ВАЖНО: получаем визуальные размеры контейнера ПОСЛЕ масштабирования
      // Для этого временно сбрасываем translate, чтобы получить только размеры с учетом scale
      const originalTransform = container.style.transform;
      container.style.transform = `scale(${zoom})`;
      const containerRect = container.getBoundingClientRect();
      container.style.transform = originalTransform;
      
      // Вычисляем ограничения
      let limitedTranslate = { ...newTranslate };
      
      // Горизонтальные ограничения
      if (containerRect.width <= wrapperRect.width) {
        // Контейнер помещается в wrapper - центрируем
        limitedTranslate.x = (wrapperRect.width - containerRect.width) / 2;
      } else {
        // Контейнер шире wrapper - ограничиваем
        const minX = wrapperRect.width - containerRect.width; // Правый край контейнера не выходит за правый край wrapper
        const maxX = 0; // Левый край контейнера не выходит за левый край wrapper
        
        limitedTranslate.x = Math.min(maxX, Math.max(minX, limitedTranslate.x));
      }
      
      // Вертикальные ограничения
      if (containerRect.height <= wrapperRect.height) {
        // Контейнер помещается в wrapper - центрируем
        limitedTranslate.y = (wrapperRect.height - containerRect.height) / 2;
      } else {
        // Контейнер выше wrapper - ограничиваем
        const minY = wrapperRect.height - containerRect.height; // Нижний край контейнера не выходит за нижний край wrapper
        const maxY = 0; // Верхний край контейнера не выходит за верхний край wrapper
        
        limitedTranslate.y = Math.min(maxY, Math.max(minY, limitedTranslate.y));
      }
      
      // Применяем новое смещение
      setLastTranslate(limitedTranslate);
      applyTransform();
    }
    
    // Функция для сброса состояния перетаскивания
    function resetDragState(e) {
      if (!isDragging) return;
      
      isDragging = false;
      if (e && e.pointerId) {
        container.releasePointerCapture(e.pointerId);
      }
      
      // Обновляем курсор после завершения перетаскивания
      updateCursor();
      
      // Удаляем класс dragging
      container.classList.remove('dragging');
      // Удаляем класс с body
      document.body.classList.remove('map-dragging');
      document.body.style.userSelect = '';
      
      // Вызываем событие завершения перетаскивания для линейки
      const dragEndEvent = new CustomEvent('dragend', {
        bubbles: true,
        cancelable: false,
        detail: {
          timestamp: Date.now()
        }
      });
      document.dispatchEvent(dragEndEvent);
    }
    
    // Обработчик для завершения перетаскивания
    function onPointerUp(e) {
      resetDragState(e);
    }
    
    // Обработчик для отмены перетаскивания
    function onPointerCancel(e) {
      resetDragState(e);
    }
    
    // Обработчик для события когда курсор входит в контейнер
    function onPointerEnter(e) {
      if (!isDragging && !isRulerActive()) {
        updateCursor();
      }
    }
    
    // Обработчик для события когда курсор выходит из контейнера
    function onPointerLeave(e) {
      if (!isDragging) {
        // Восстанавливаем стандартный курсор
        container.style.cursor = 'default';
      }
    }
    
    // Обработчик изменения состояния линейки
    function onRulerChange(e) {
      // Обновляем курсор в соответствии с состоянием линейки
      updateCursor();
    }
    
    // Удаляем предыдущие обработчики, если такие есть
    container.removeEventListener('pointerdown', onPointerDown);
    container.removeEventListener('pointermove', onPointerMove);
    container.removeEventListener('pointerup', onPointerUp);
    container.removeEventListener('pointercancel', onPointerCancel);
    container.removeEventListener('pointerleave', onPointerUp);
    container.removeEventListener('pointerenter', onPointerEnter);
    
    // Добавляем обработчики событий
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerCancel);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('pointerenter', onPointerEnter);
    
    // Обновляем CSS стиль для драга
    const styleTag = document.getElementById('drag-cursor-styles');
    if (styleTag) {
      styleTag.remove(); // Удаляем предыдущие стили если они есть
    }
    
    const styleElement = document.createElement('style');
    styleElement.id = 'drag-cursor-styles';
    styleElement.textContent = `
      .map-dragging {
        cursor: grabbing !important;
      }
      
      .map-dragging * {
        cursor: grabbing !important;
      }
      
      #zoom-container {
        cursor: default;
      }
      
      #zoom-container.dragging {
        cursor: grabbing !important;
      }
      
      /* Отключаем все возможные курсоры запрета на элементах */
      * {
        cursor: inherit;
      }
      
      /* Меняем курсор для всех not-allowed на default */
      *[style*="cursor: not-allowed"] {
        cursor: default !important;
      }
      
      /* Форсируем курсор для линейки */
      .ruler-circle, .ruler-line, .ruler-distance-label {
        cursor: default !important;
      }
      
      /* Курсор для режима линейки */
      #zoom-container.ruler-active {
        cursor: crosshair !important;
      }
      
      /* Когда линейка активна, устанавливаем crosshair для всего контейнера */
      #ruler-switch-checkbox:checked ~ #ruler-switch-container + #zoom-container,
      #ruler-switch-checkbox:checked ~ #ruler-switch-container + * #zoom-container {
        cursor: crosshair !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Добавляем слушатель для изменения чекбокса линейки
    const rulerSwitch = document.getElementById('ruler-switch-checkbox');
    if (rulerSwitch) {
      rulerSwitch.addEventListener('change', onRulerChange);
    }
    
    // Добавляем слушатель для события изменения класса линейки
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && 
            mutation.target === container) {
          const hasRulerClass = container.classList.contains('ruler-active');
          if (hasRulerClass) {
            container.style.cursor = 'crosshair';
          } else {
            updateCursor();
          }
        }
      });
    });
    
    observer.observe(container, { attributes: true });
    
    // Добавляем слушатель для события завершения перетаскивания
    document.addEventListener('dragend', function() {
      // Вызываем функцию восстановления трекинга линейки, если она существует
      if (window.restoreRulerTracker && typeof window.restoreRulerTracker === 'function') {
        window.restoreRulerTracker();
      }
    });
    
    // Инициализируем надлежащий курсор при запуске
    setTimeout(updateCursor, 100);
    
    return true;
  }
