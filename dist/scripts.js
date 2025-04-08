const VK_SERVICE_KEY = "902c24b6902c24b6902c24b6f09302f59f9902c902c24b6f7d83e038215132524e85fe6";
const GROUP_ID = "pp4wikipedia";
const MAP_NAMES = [
  "волхов", "острог", "ахтуба", "тунгуска", "яма", "донец",
  "ладожское", "медвежье", "куори", "белая", "сура", "вьюнок",
  "комариное", "янтарное", "архипелаг", "норвежское", "штрафной", "медное"
];

// Функція для отримання номера тижня
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Функція для отримання назви файлу JSON
function getWeeklyFileName() {
  const now = new Date();
  const year = now.getFullYear();
  const week = getWeekNumber(now);
  return `${year}-week-${week}.json`;
}

// Функція для збереження даних у JSON
function saveDataToWeeklyFile(newData) {
  const fileName = getWeeklyFileName();

  // Перевірка, чи існує файл у LocalStorage
  let weeklyData = JSON.parse(localStorage.getItem(fileName)) || [];

  // Додавання нових даних
  weeklyData.push(newData);

  // Збереження оновленого масиву у LocalStorage
  localStorage.setItem(fileName, JSON.stringify(weeklyData));

  console.log(`Дані збережено у файл: ${fileName}`);
}

// Функція для отримання останніх постів з VK
async function getLatestVKPost() {
  const url = `https://api.vk.com/method/wall.get?owner_id=-161310162&count=10&access_token=${VK_SERVICE_KEY}&v=5.199`;
  const response = await fetch(url);
  const json = await response.json();

  const posts = json.response.items;

  if (!posts || posts.length === 0) {
    console.log("Постів не знайдено.");
    return;
  }

  // Отримання існуючих URL з LocalStorage
  const fileName = getWeeklyFileName();
  const existingData = JSON.parse(localStorage.getItem(fileName)) || [];
  const existingUrls = existingData.map(post => post.postUrl);

  let newPostsAdded = 0;

  for (const post of posts) {
    const postId = post.id;
    const ownerId = post.owner_id;
    const postUrl = `https://vk.com/wall${ownerId}_${postId}`;

    // Якщо пост вже є в JSON, пропускаємо його
    if (existingUrls.includes(postUrl)) {
      console.log(`Пост з URL ${postUrl} вже перенесений.`);
      continue;
    }

    // Якщо пост не містить тегів гри, пропускаємо його
    const containsValidTag = MAP_NAMES.some(tag => post.text.toLowerCase().includes(`#${tag}@pp4wikipedia`));
    if (!containsValidTag) {
      console.log(`Пост з URL ${postUrl} не має правильного тегу і ігнорується.`);
      continue;
    }

    // Формування даних для збереження
    const date = new Date(post.date * 1000).toLocaleString();
    const text = post.text || "";

    // 🗺️ Локація
    let location = "";
    const locationMatch = text.toLowerCase().match(/#([а-яёa-z]+)@pp4wikipedia/);
    if (locationMatch) {
      const rawLoc = locationMatch[1];
      if (MAP_NAMES.includes(rawLoc)) {
        location = `🗺️ ${rawLoc.charAt(0).toUpperCase() + rawLoc.slice(1)}`;
      }
    }

    // 🐟 Риба
    const fishMatch = text.match(/🐟\s*(.*)/);
    const fish = fishMatch ? `🐟 ${fishMatch[1].trim()}` : "";

    // 📌 Координати
    let coords = "";
    const coordsMatch = text.match(/📌\s*(\d{1,3}:\d{1,3})/);
    if (coordsMatch) {
      coords = "📌 " + coordsMatch[1].trim().replace(/:/g, '.');
    } else {
      const coordsTextMatch = text.match(/📌\s*(.*)/);
      if (coordsTextMatch) {
        coords = "📌 " + coordsTextMatch[1].trim();
      }
    }

    // 🎣 Кліпса
    let clip = "";
    const clipExplicitMatch = text.match(/Клипса\s*(\d{1,2})/i);
    if (clipExplicitMatch) {
      clip = `🎣 Клипса ${clipExplicitMatch[1].trim()}`;
    } else {
      const clipLineMatch = text.match(/🎣([^\n\r]*)/);
      if (clipLineMatch) {
        clip = `🎣 ${clipLineMatch[1].trim()}`;
      }
    }

    // 📝 Опис
    const descMatch = text.match(/📝\s*(.*)/s);
    const description = descMatch ? `📝 ${descMatch[1].trim()}` : "";

    // Формування об'єкта для збереження
    const parsedData = {
      date,
      location,
      fish,
      coords,
      clip,
      description,
      postUrl
    };

    // Збереження даних у JSON
    saveDataToWeeklyFile(parsedData);
    newPostsAdded++;
  }

  if (newPostsAdded === 0) {
    console.log("Не знайдено нових підходящих постів.");
  } else {
    console.log(`Успішно додано ${newPostsAdded} нових постів.`);
  }
}

// Виклик функції
getLatestVKPost();


// Функція для завантаження JSON-файлу як архів
function downloadWeeklyFile() {
    const fileName = getWeeklyFileName();
    const data = localStorage.getItem(fileName);
  
    if (!data) {
      console.log("Немає даних для цього тижня.");
      return;
    }
  
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  
    console.log(`Файл ${fileName} завантажено.`);
  }