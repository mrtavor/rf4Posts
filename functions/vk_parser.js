const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
const path = require('path');

// Константи
const POSTS_FOLDER = path.resolve(process.cwd(), 'public/data/posts'); // Шлях до папки для файлів постів
const INDEX_FILE_PATH = path.resolve(process.cwd(), 'public/data/posts_index.json'); // Шлях до posts_index.json
const API_VERSION = "5.199";
const VK_SERVICE_KEY = "902c24b6902c24b6902c24b6f09302f59f9902c902c24b6f7d83e038215132524e85fe6"; // Ключ доступу
const GROUP_ID = "161310162"; // Числовий ID групи
const FOUR_HOURS_IN_SECONDS = 4 * 60 * 60; // 4 години в секундах

// Дозволені теги карт
const ALLOWED_TAGS = [
  "#волхов@pp4wikipedia", "#острог@pp4wikipedia", "#ахтуба@pp4wikipedia",
  "#тунгуска@pp4wikipedia", "#яма@pp4wikipedia", "#донец@pp4wikipedia",
  "#ладожское@pp4wikipedia", "#медвежье@pp4wikipedia", "#куори@pp4wikipedia",
  "#белая@pp4wikipedia", "#сура@pp4wikipedia", "#вьюнок@pp4wikipedia",
  "#комариное@pp4wikipedia", "#янтарное@pp4wikipedia", "#архипелаг@pp4wikipedia",
  "#норвежское@pp4wikipedia", "#штрафной@pp4wikipedia", "#медное@pp4wikipedia"
];

// Перевіряємо, чи папка для постів існує, і створюємо її, якщо ні
if (!fs.existsSync(POSTS_FOLDER)) {
  fs.mkdirSync(POSTS_FOLDER, { recursive: true });
}

// Функція для отримання шляху до файлу постів
function getFilePath() {
  const today = new Date();
  const isMonday = today.getDay() === 1; // 1 відповідає понеділку
  const formattedDate = today.toISOString().split('T')[0]; // Формат дати YYYY-MM-DD
  const newFileName = `vk_posts_${formattedDate}.json`;
  const newFilePath = path.join(POSTS_FOLDER, newFileName);

  if (isMonday && today.getHours() === 0 && today.getMinutes() === 0 && today.getSeconds() === 0) {
    // Якщо сьогодні понеділок і час 00:00:00, створюємо новий файл
    console.log(`Сьогодні понеділок 00:00:00. Створюємо новий файл: ${newFilePath}`);
    return newFilePath;
  }

  // Якщо не понеділок або час не 00:00:00, використовуємо найновіший файл
  const files = fs.readdirSync(POSTS_FOLDER).filter(file => /^vk_posts_\d{4}-\d{2}-\d{2}\.json$/.test(file));

  if (files.length === 0) {
    console.log(`Файли не знайдено. Створюємо новий файл: ${newFilePath}`);
    return newFilePath;
  }

  // Сортуємо файли за датою у зворотному порядку
  files.sort((a, b) => {
    const dateA = a.match(/\d{4}-\d{2}-\d{2}/)[0];
    const dateB = b.match(/\d{4}-\d{2}-\d{2}/)[0];
    return dateB.localeCompare(dateA); // Найновіший файл буде першим
  });

  const latestFile = path.join(POSTS_FOLDER, files[0]);
  console.log(`Сьогодні не понеділок або час не 00:00:00. Використовуємо найновіший файл: ${latestFile}`);
  return latestFile;
}

// Функція для отримання даних з API ВКонтакте
async function fetchVKPosts() {
  const url = `https://api.vk.com/method/wall.get?owner_id=-${GROUP_ID}&count=10&access_token=${VK_SERVICE_KEY}&v=${API_VERSION}`;
  const filePath = getFilePath();

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("Помилка API:", data.error);
      return;
    }

    const existingPosts = getExistingPosts(filePath); // Отримуємо існуючі пости з файлу

    // Знаходимо останній `post_id` серед існуючих постів
    const lastPostId = existingPosts.length > 0 
      ? Math.max(...existingPosts.map(post => post.post_id)) 
      : 0;

    const postsToAdd = [];
    const currentTime = Math.floor(Date.now() / 1000); // Поточний час у секундах

    for (const post of data.response.items) {
      const text = post.text;

      // Перевіряємо, чи пост не старший ніж 4 години
      if (currentTime - post.date > FOUR_HOURS_IN_SECONDS) {
        continue; // Пропускаємо пости старші за 4 години
      }

      // Знаходимо карту (наприклад, #ахтуба@pp4wikipedia)
      const mapMatch = text.match(/#([\wа-яА-ЯёЁ]+)@pp4wikipedia/);
      if (!mapMatch) continue;

      const mapName = mapMatch[1]; // Витягуємо лише назву карти (наприклад, "ахтуба")

      // Перевіряємо, чи тег карти дозволений
      if (!ALLOWED_TAGS.includes(`#${mapName}@pp4wikipedia`)) continue;

      // Перевіряємо, чи пост вже є у файлі
      const postURL = `https://vk.com/wall-${GROUP_ID}_${post.id}`;
      if (existingPosts.some(existingPost => existingPost.post_URL === postURL)) {
        continue; // Пропускаємо, якщо пост вже є у файлі
      }

      // Парсинг тексту посту
      const fishMatch = text.match(/🐟(.+)/); // Знаходимо рибу (наприклад, Карп чешуйчатый)
      const coordinatesMatch = text.match(/📌(.+)/); // Знаходимо координати (будь-який текст після 📌)
      const clipMatch = text.match(/🎣(.+)/); // Знаходимо кліпсу (будь-який текст після 🎣)
      const descriptionMatch = text.match(/📝(.+)/); // Знаходимо опис (наприклад, текст після 📝)

      // Обробка координат
      const coordinates = coordinatesMatch ? coordinatesMatch[1].trim() : "Немає координат";

      // Обробка кліпси
      const clip = clipMatch ? clipMatch[1].trim() : "Немає кліпси";

      // Якщо кліпса не містить слово "Клипса", зберігаємо весь рядок без змін
      const validClip = clipMatch ? clip : "Немає кліпси";

      // Додаємо пост, якщо він унікальний
      postsToAdd.push({
        post_id: lastPostId + postsToAdd.length + 1, // Присвоюємо унікальний `post_id`
        post_URL: postURL, // URL посту
        date: new Date(post.date * 1000).toISOString().replace('T', ' ').split('.')[0], // Час і дата
        map: mapName, // Назва карти (наприклад, "ахтуба")
        fish: fishMatch ? fishMatch[1].trim() : "Невідомо", // Риба
        coordinates: coordinates, // Координати
        clip: validClip, // Кліпса
        description: descriptionMatch ? descriptionMatch[1].trim() : "Немає опису" // Опис
      });

      // Якщо додано 5 нових постів, зупиняємо цикл
      if (postsToAdd.length === 5) break;
    }

    if (postsToAdd.length > 0) {
      saveToJSON(postsToAdd, filePath);
    } else {
      console.log("Нових постів для додавання немає.");
    }
  } catch (error) {
    console.error("Помилка при отриманні даних:", error);
  }
}

// Функція для збереження даних у JSON-файл
function saveToJSON(newPosts, filePath) {
  let existingPosts = getExistingPosts(filePath);

  // Додаємо нові пости до існуючих
  const updatedPosts = [
    ...existingPosts,
    ...newPosts.filter(newPost => !existingPosts.some(existingPost => existingPost.post_URL === newPost.post_URL))
  ];

  // Записуємо оновлені дані у файл
  fs.writeFile(filePath, JSON.stringify(updatedPosts, null, 2), (err) => {
    if (err) {
      console.error("Помилка при записі у файл:", err);
    } else {
      console.log(`Дані успішно збережено у файл: ${filePath}`);

      // Після збереження оновлюємо posts_index.json
      updatePostsIndex();
    }
  });
}

// Функція для отримання існуючих постів з файлу
function getExistingPosts(filePath) {
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  }
  return [];
}

// Функція для запуску перевірки кожні 10 хвилин
function startFetching() {
  fetchVKPosts(); // Виконуємо перший запит одразу
  setInterval(fetchVKPosts, 20 * 60 * 1000); // Повторюємо кожні 10 хвилин
}

// Функція для оновлення індексу постів
function updatePostsIndex() {
  const files = fs.readdirSync(POSTS_FOLDER)
    .filter(file => /^vk_posts_\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .map(file => `posts/${file}`); // Додаємо відносний шлях

  files.sort((a, b) => {
    const dateA = a.match(/\d{4}-\d{2}-\d{2}/)[0];
    const dateB = b.match(/\d{4}-\d{2}-\d{2}/)[0];
    return dateB.localeCompare(dateA);
  });

  // Перевіряємо чи існує папка data
  const dataFolder = path.dirname(INDEX_FILE_PATH);
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
  }

  fs.writeFile(INDEX_FILE_PATH, JSON.stringify(files, null, 2), err => {
    if (err) {
      console.error("Помилка при оновленні posts_index.json:", err);
    } else {
      console.log(`Файл ${INDEX_FILE_PATH} оновлено успішно.`);
    }
  });
}

// Запуск процесу
startFetching();