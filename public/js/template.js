const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get('title');
const image = urlParams.get('image');

document.getElementById('title').textContent = title;
document.getElementById('image').src = `images/${image}`;

const normalize = str => str.toLowerCase().replace(/[^а-яa-z0-9]/gi, '');
const normalizedTitle = normalize(title);

const postsContainer = document.getElementById('posts-container');

// 1. Завантажуємо список доступних файлів
fetch('data/posts_index.json')
  .then(res => {
    if (!res.ok) throw new Error('Не вдалося завантажити список файлів');
    return res.json();
  })
  .then(fileList => {
    if (!fileList || fileList.length === 0) {
      throw new Error('Список файлів пустий');
    }

    // 2. Сортуємо список за датою у зворотному порядку
    fileList.sort((a, b) => {
      const dateA = a.match(/\d{4}-\d{2}-\d{2}/);
      const dateB = b.match(/\d{4}-\d{2}-\d{2}/);
      return dateB[0].localeCompare(dateA[0]); // найновіший буде перший
    });

    const latestFile = fileList[0];

    // 3. Завантажуємо найновіший JSON
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
      postsContainer.innerHTML = `<p>Немає постів для цієї локації.</p>`;
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
      postsContainer.appendChild(div);
    });
  })
  .catch(error => {
    console.error('Помилка:', error);
    postsContainer.innerHTML = `<p>Не вдалося завантажити пости.</p>`;
  });
