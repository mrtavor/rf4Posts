function pixelToGameCoords(x_pixel, y_pixel, mapData, scaleX, scaleY) {
    const { left_top } = mapData.game_coords;

    // Перетворення піксельних координат у ігрові
    const gameX = left_top[0] + x_pixel / scaleX;
    const gameY = left_top[1] - (y_pixel / scaleY);

    return { gameX, gameY };
}

function calculateScale(mapData, imageWidth, imageHeight) {
  if (!mapData?.game_coords?.left_top || !mapData?.game_coords?.right_bottom) {
    console.error('Некоректна структура mapData:', mapData);
    return { scaleX: 1, scaleY: 1 }; // Повертаємо стандартні значення, щоб уникнути помилок
  }

  const { left_top, right_bottom } = mapData.game_coords;

  // Розміри карти в ігрових одиницях
  const gameWidth = right_bottom[0] - left_top[0];
  const gameHeight = left_top[1] - right_bottom[1];

  // Масштаб
  const scaleX = imageWidth / gameWidth;
  const scaleY = imageHeight / gameHeight;

  return { scaleX, scaleY };
}

function normalize(str) {
  return str.toLowerCase().replace(/[^а-яa-z0-9]/gi, '');
}

function normalizeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const title = urlParams.get('title') || '';
  return normalize(title);
}

export function setupMouseCoordinateDisplay(imageId, mapData) {
  console.log('mapData передано у setupMouseCoordinateDisplay:', mapData);

  // Отримуємо назву сторінки з URL
  const normalizedTitle = normalizeFromURL();

  // Знаходимо інформацію про карту на основі назви
  const mapInfo = mapData.find(m => normalize(m.name) === normalizedTitle);

  if (!mapInfo?.game_coords) {
    console.error('Не знайдено інформації про мапу для назви:', normalizedTitle);
    return;
  }

  const image = document.getElementById(imageId);
  const coordinatesDisplay = document.createElement('div');

  // Стилізація блоку для відображення координат
  coordinatesDisplay.style.position = 'absolute';
  coordinatesDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  coordinatesDisplay.style.color = 'white';
  coordinatesDisplay.style.padding = '5px 10px';
  coordinatesDisplay.style.borderRadius = '5px';
  coordinatesDisplay.style.fontSize = '14px';
  coordinatesDisplay.style.zIndex = '1000';
  coordinatesDisplay.style.display = 'none';
  coordinatesDisplay.textContent = '0:0';

  document.body.appendChild(coordinatesDisplay);

  // Додаємо обробник події для відстеження руху миші
  image.addEventListener('mousemove', (event) => {
    const rect = image.getBoundingClientRect();
    const x_pixel = event.clientX - rect.left;
    const y_pixel = event.clientY - rect.top;

    const mapWidth = rect.width;
    const mapHeight = rect.height;

    const { scaleX, scaleY } = calculateScale(mapInfo, mapWidth, mapHeight);

    // Перетворюємо піксельні координати у ігрові
    const { gameX, gameY } = pixelToGameCoords(x_pixel, y_pixel, mapInfo, scaleX, scaleY);

    // Оновлюємо текст у блоці
    coordinatesDisplay.textContent = `${Math.floor(gameX)}:${Math.floor(gameY)}`;

    // Відображаємо блок і прив'язуємо його до мишки
    coordinatesDisplay.style.display = 'block';
    coordinatesDisplay.style.left = `${event.pageX + 10}px`; // З правого боку мишки
    coordinatesDisplay.style.top = `${event.pageY + 10}px`; // Знизу мишки

    image.addEventListener('mouseleave', () => {
        coordinatesDisplay.style.display = 'none';
      });
  });

  // Очищуємо координати, коли мишка виходить за межі зображення
  image.addEventListener('mouseleave', () => {
    coordinatesDisplay.textContent = '0:0';
  });
}