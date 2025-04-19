document.addEventListener('DOMContentLoaded', () => {
  // Імпортуємо дані карт
  import('../maps/mapsData.js').then(module => {
    const mapsData = module.mapsData;
    window.mapsData = mapsData; // Додаємо в глобальний контекст для доступу з інших частин коду
  
    const rulerSwitch = document.getElementById('ruler-switch-checkbox');
    let rulerActive = rulerSwitch && rulerSwitch.checked;
    let startPoint = null;
    let endPoint = null;
    let lineElem = null;
    let startCircle = null;
    let endCircle = null;
    let distanceLabel = null;
  
    if (rulerSwitch) {
      rulerSwitch.addEventListener('change', () => {
        rulerActive = rulerSwitch.checked;
        clearRuler();
      });
    }

    function clearRuler() {
      startPoint = null;
      endPoint = null;
      if (lineElem) lineElem.remove();
      if (startCircle) startCircle.remove();
      if (endCircle) endCircle.remove();
      if (distanceLabel) distanceLabel.remove();
      lineElem = startCircle = endCircle = distanceLabel = null;
    }

    const zoomContainer = document.getElementById('zoom-container');
    if (zoomContainer) {
      zoomContainer.addEventListener('mousedown', function(e) {
        if (!rulerActive || e.button !== 0) return;
        const img = document.getElementById('image');
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Відступ 78px від краю
        if (x < 78 || y < 78 || x > rect.width - 78 || y > rect.height - 78) return;

        if (!startPoint) {
          startPoint = { x, y };
          startCircle = createRulerCircle(x, y);
          zoomContainer.appendChild(startCircle);
          // Слухаємо рух миші
          zoomContainer.addEventListener('mousemove', onRulerMove);
        } else if (!endPoint) {
          endPoint = { x, y };
          endCircle = createRulerCircle(x, y);
          zoomContainer.appendChild(endCircle);
          zoomContainer.removeEventListener('mousemove', onRulerMove);
          showDistanceLabel(startPoint, endPoint);
        }
      });

      zoomContainer.addEventListener('contextmenu', function(e) {
        if (rulerActive) {
          e.preventDefault();
          clearRuler();
          // Дозволяємо одразу ставити нову пару точок, якщо світч увімкнений
          // (нічого додатково не треба, бо rulerActive залишається true)
        }
      });
    }

    function onRulerMove(e) {
      const img = document.getElementById('image');
      const rect = img.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (lineElem) lineElem.remove();
      lineElem = drawRulerLine(startPoint.x, startPoint.y, x, y);
      zoomContainer.appendChild(lineElem);
    }

    function createRulerCircle(x, y) {
      const circle = document.createElement('div');
      circle.className = 'ruler-circle';
      circle.style.position = 'absolute';
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
      circle.style.width = '32px';
      circle.style.height = '32px';
      circle.style.border = '3px solid #007bff';
      circle.style.background = 'rgba(0,123,255,0.2)';
      circle.style.borderRadius = '50%';
      circle.style.transform = 'translate(-50%, -50%)';
      circle.style.pointerEvents = 'none';
      return circle;
    }

    function drawRulerLine(x1, y1, x2, y2) {
      const line = document.createElement('div');
      const length = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
      const angle = Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;
      line.style.position = 'absolute';
      line.style.left = `${x1}px`;
      line.style.top = `${y1}px`;
      line.style.width = `${length}px`;
      line.style.height = '2px';
      line.style.background = '#007bff';
      line.style.transform = `rotate(${angle}deg)`;
      line.style.transformOrigin = '0 0';
      line.style.pointerEvents = 'none';
      return line;
    }

    function showDistanceLabel(p1, p2) {
      // Вираховуємо відстань у пікселях
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const pxDist = Math.sqrt(dx*dx + dy*dy);

      // Отримуємо розмір одного квадрату в метрах для поточної карти
      // (приклад: mapsData[title]?.squareSize)
      const urlParams = new URLSearchParams(window.location.search);
      const title = urlParams.get('title') || '';
      const mapInfo = window.mapsData?.[title];
      const squareSize = mapInfo?.squareSize || 37; // за замовчуванням 37м

      // Вираховуємо ширину одного квадрату в пікселях (карта 10x10)
      const img = document.getElementById('image');
      const pxPerSquare = (img.width - 156) / 10; // 78px зліва і справа

      // Відстань у метрах
      const meters = (pxDist / pxPerSquare) * squareSize;
      distanceLabel = document.createElement('div');
      distanceLabel.className = 'ruler-distance-label';
      distanceLabel.textContent = `${meters.toFixed(1)} м`;
      distanceLabel.style.position = 'absolute';
      distanceLabel.style.left = `${p2.x}px`;
      distanceLabel.style.top = `${p2.y - 30}px`;
      distanceLabel.style.background = '#fff';
      distanceLabel.style.border = '1px solid #007bff';
      distanceLabel.style.padding = '2px 8px';
      distanceLabel.style.borderRadius = '6px';
      distanceLabel.style.fontWeight = 'bold';
      distanceLabel.style.transform = 'translate(-50%, -100%)';
      distanceLabel.style.pointerEvents = 'none';
      zoomContainer.appendChild(distanceLabel);
    }
  });
});
