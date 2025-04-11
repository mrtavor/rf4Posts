// postHoverHandler.js
export function setupPostHoverHighlight() {
    const posts = document.querySelectorAll('.post');
    const dotsLayer = document.getElementById('dots-layer');
    let highlightedDot = null;
  
    // Створюємо стиль для підсвіченої точки
    const highlightStyle = {
      position: 'absolute',
      width: '20px',
      height: '20px',
      backgroundColor: '#54c47a',
      borderRadius: '70%',
      border: '3px solid #1b3d26',
      boxShadow: '0 0 10px rgba(43, 43, 43, 0.208);',
      zIndex: '1000',
      pointerEvents: 'none',
      transform: 'translate(-50%, -50%)',
    };
  
    posts.forEach(post => {
      // Обробник для наведення
      post.addEventListener('mouseenter', () => {
        const coordsText = post.querySelector('p:nth-child(3)').textContent;
        const coords = extractCoordinates(coordsText);
        
        if (coords) {
          // Видаляємо попередню підсвічену точку
          if (highlightedDot) {
            dotsLayer.removeChild(highlightedDot);
          }
          
          // Створюємо нову підсвічену точку
          highlightedDot = document.createElement('div');
          Object.assign(highlightedDot.style, highlightStyle);
          
          // Отримуємо позицію для точки (вам потрібно передати mapData)
          const mapData = window.currentMapData; // Припускаємо, що mapData доступний глобально
          if (mapData) {
            const position = calculateDotPosition(coords, mapData);
            highlightedDot.style.left = `${position.x}px`;
            highlightedDot.style.top = `${position.y}px`;
            dotsLayer.appendChild(highlightedDot);
          }
        }
      });
  
      // Обробник для коли миші йде з поста
      post.addEventListener('mouseleave', () => {
        if (highlightedDot) {
          dotsLayer.removeChild(highlightedDot);
          highlightedDot = null;
        }
      });
    });
  }
  
  // Функція для витягування координат з тексту
  function extractCoordinates(text) {
    const match = text.match(/(\d{1,3})[:,\s](\d{1,3})/);
    if (match) {
      return {
        x: parseFloat(match[1]),
        y: parseFloat(match[2])
      };
    }
    return null;
  }
  
  // Функція для розрахунку позиції точки (аналогічно до drawCircleOnMap)
  function calculateDotPosition(coords, mapData) {
    const img = document.getElementById('image');
    const mapInfo = mapData.find(m => normalize(m.name) === normalizeFromURL());
    
    if (!img || !mapInfo) return { x: 0, y: 0 };
  
    const { left_top, right_bottom } = mapInfo.game_coords;
    const mapRect = img.getBoundingClientRect();
    
    const minX = left_top[0];
    const maxX = right_bottom[0];
    const maxY = left_top[1];
    const minY = right_bottom[1];
  
    const scaleX = mapRect.width / (maxX - minX);
    const scaleY = mapRect.height / (maxY - minY);
  
    return {
      x: (coords.x - minX) * scaleX,
      y: mapRect.height - (coords.y - minY) * scaleY
    };
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