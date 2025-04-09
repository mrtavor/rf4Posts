const functions = require('firebase-functions');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

// Функція для отримання файлу JSON з Firebase Storage
exports.getLatestPosts = functions.https.onRequest(async (req, res) => {
  try {
    const bucket = storage.bucket('your-bucket-name'); // заміни на правильну назву твого бакету
    const file = bucket.file('data/vk_posts_2025-04-08.json'); // правильний шлях до файлу

    // Завантажуємо файл з Firebase Storage
    const fileContents = await file.download();
    const postsData = JSON.parse(fileContents.toString());

    res.json(postsData); // Відправляємо дані як JSON
  } catch (error) {
    console.error('Error downloading the file:', error);
    res.status(500).send('Error fetching posts');
  }
});