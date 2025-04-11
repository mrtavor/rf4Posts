// template.js
import { loadMapData, drawCircleOnMap, syncDotsLayerSize, redrawAllPoints } from './mapUtils.js';
import { setupMouseCoordinateDisplay } from './mouseCoords.js';
import { setupPostHoverHighlight } from './postHoverHandler.js';

const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get('title');
const image = urlParams.get('image');

document.getElementById('title').textContent = title;
document.getElementById('image').src = `images/${image}`;

const normalize = str => str.toLowerCase().replace(/[^а-яa-z0-9]/gi, '');
const normalizedTitle = normalize(title);

const postsContainer = document.getElementById('posts-container');

let allPoints = [];

// Завантажуємо список доступних файлів
fetch('data/posts_index.json')
  .then(res => {
    if (!res.ok) throw new Error('Не вдалося завантажити список файлів');
    return res.json();
  })
  .then(fileList => {
    if (!fileList || fileList.length === 0) {
      throw new Error('Список файлів пустий');
    }

    // Сортуємо список за датою у зворотному порядку
    fileList.sort((a, b) => {
      const dateA = a.match(/\d{4}-\d{2}-\d{2}/);
      const dateB = b.match(/\d{4}-\d{2}-\d{2}/);
      return dateB[0].localeCompare(dateA[0]);
    });

    const latestFile = fileList[0];

    // Завантажуємо найновіший JSON
    return fetch(`data/posts/${latestFile}`);
  })
  .then(res => {
    if (!res.ok) throw new Error('Не вдалося завантажити файл з постами');
    return res.json();
  })
  .then(posts => {
    const filtered = posts.filter(post => {
      const postMapNorm = normalize(post.map);
      return postMapNorm.includes(normalizedTitle) || normalizedTitle.includes(postMapNorm);
    });
  
    loadMapData().then(mapData => {
      // Зберігаємо дані карти для використання в підсвітці
      window.currentMapData = mapData;

      setupMouseCoordinateDisplay('image', mapData);

      if (filtered.length === 0) {
        postsContainer.innerHTML = '<p>Немає постів для цієї локації.</p>';
        return;
      }


      filtered.forEach(post => {
        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `
          <h3>${post.fish}</h3>
          <p><strong>Дата:</strong> ${post.date}</p>
          <p><strong>Координати:</strong> ${post.coordinates}</p>
          <p><strong>Кліпса:</strong> ${post.clip}</p>
          <p>${post.description}</p>
          <a href="${post.post_URL}" target="_blank">Посилання на пост</a>
        `;
        
        // Додаємо атрибут з координатами для подальшого використання
        const coords = extractValidCoords(post.coordinates);
        if (coords.length > 0) {
          div.dataset.coords = JSON.stringify(coords[0]);
        }
        
        postsContainer.appendChild(div);
      });

      // Малюємо всі точки на карті
      filtered.forEach(post => {
        const validCoords = extractValidCoords(post.coordinates);
        validCoords.forEach(coord => {
          allPoints.push(coord);
          drawCircleOnMap('image', coord, mapData);
        });
      });

      syncDotsLayerSize('image');
      window.addEventListener('resize', () => {
        syncDotsLayerSize('image');
        redrawAllPoints('image', mapData, allPoints);
      });
      
      setupMouseCoordinateDisplay('image', mapData);
      setupPostHoverHighlight(); // Ініціалізуємо підсвітку точок
    }).catch(error => {
      console.error('Помилка карти:', error);
    });
  })
  .catch(error => {
    console.error('Помилка завантаження:', error);
    postsContainer.innerHTML = '<p>Помилка завантаження даних.</p>';
  });

// Функція для витягування координат
function extractValidCoords(text) {
  const coordPattern = /\b(\d{1,3})[:,\s](\d{1,3})\b/g;
  const matches = [];
  let match;
  
  while ((match = coordPattern.exec(text)) !== null) {
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);
    if (!isNaN(x) && !isNaN(y)) {
      matches.push({ x, y });
    }
  }
  return matches;
}