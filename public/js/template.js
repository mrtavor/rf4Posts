// template.js
import { loadMapData, drawCircleOnMap, syncDotsLayerSize, redrawAllPoints } from './mapUtils.js';
import { setupMouseCoordinateDisplay } from './mouseCoords.js';

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
      return dateB[0].localeCompare(dateA[0]); // найновіший буде перший
    });

    const latestFile = fileList[0];

    // Завантажуємо найновіший JSON
    return fetch(`data/${latestFile}`);
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

    if (filtered.length === 0) {
      postsContainer.innerHTML = '<p>Немає постів для цієї локації.</p>';
      return;
    }

    // Завантажуємо дані карти
    loadMapData().then(mapData => {
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
        postsContainer.appendChild(div);

        // Перевіряємо формат координат і парсимо їх
        let gameCoords;
        if (post.coordinates.includes(':')) {
          // Формат координат 59:76
          const [x, y] = post.coordinates.split(':').map(coord => parseFloat(coord.trim()));
          gameCoords = { x, y };
        } else if (post.coordinates.includes(',')) {
          // Формат координат 59,76
          const coords = post.coordinates.split(',').map(coord => parseFloat(coord.trim()));
          gameCoords = { x: coords[0], y: coords[1] };
        } else {
          console.error('Невідомий формат координат:', post.coordinates);
          return;
        }

        // Логування координат для перевірки
        console.log('Парсинг координат:', gameCoords);

        // Синхронізація шару з крапками з розмірами зображення
        syncDotsLayerSize('image');
        // Повторна синхронізація при зміні розмірів
        window.addEventListener('resize', () => syncDotsLayerSize('image'));
        document.getElementById('image').addEventListener('load', () => syncDotsLayerSize('image'));
        allPoints.push(gameCoords); // Зберігаємо координати
        drawCircleOnMap('image', gameCoords, mapData);
        // Малюємо круг на карті
        drawCircleOnMap('image', gameCoords, mapData);
      });

      window.addEventListener('resize', () => {
        syncDotsLayerSize('image');
        redrawAllPoints('image', mapData, allPoints);
      });      

      setupMouseCoordinateDisplay('image', mapData);
    }).catch(error => {
      console.error('Помилка з даними карти:', error);
    });
  })
  .catch(error => {
    console.error('Помилка:', error);
    postsContainer.innerHTML = '<p>Не вдалося завантажити пости.</p>';
  });