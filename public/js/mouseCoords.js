import { pixelToGameCoords } from './mapUtils.js';

export function setupMouseCoordinateDisplay(imageId, mapData) {
  const image = document.getElementById(imageId);
  const coordinatesDisplay = document.createElement('div');

  // Стилізація блоку для відображення координат
  coordinatesDisplay.style.position = 'absolute';
  coordinatesDisplay.style.top = '10px';
  coordinatesDisplay.style.left = '10px';
  coordinatesDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  coordinatesDisplay.style.color = 'white';
  coordinatesDisplay.style.padding = '5px 10px';
  coordinatesDisplay.style.borderRadius = '5px';
  coordinatesDisplay.style.fontSize = '14px';
  coordinatesDisplay.style.zIndex = '1000';
  coordinatesDisplay.textContent = 'Ігрові координати: X: 0, Y: 0';

  document.body.appendChild(coordinatesDisplay);

  // Додаємо обробник події для відстеження руху миші
  image.addEventListener('mousemove', (event) => {
    const rect = image.getBoundingClientRect();
    const x_pixel = event.clientX - rect.left;
    const y_pixel = event.clientY - rect.top;

    const mapWidth = rect.width;
    const mapHeight = rect.height;

    const { scaleX, scaleY } = calculateScale(mapData, mapWidth, mapHeight);

    // Перетворюємо піксельні координати у ігрові
    const { gameX, gameY } = pixelToGameCoords(x_pixel, y_pixel, mapData, scaleX, scaleY);

    // Оновлюємо текст у блоці
    coordinatesDisplay.textContent = `Ігрові координати: X: ${gameX.toFixed(2)}, Y: ${gameY.toFixed(2)}`;
  });

  // Очищуємо координати, коли мишка виходить за межі зображення
  image.addEventListener('mouseleave', () => {
    coordinatesDisplay.textContent = 'Ігрові координати: X: 0, Y: 0';
  });
}