const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { exec } = require('child_process');

// Путь к файлу с версией и заметками о релизе
const releasePath = path.join(__dirname, 'public/data/release-notes.json');
const versionPath = path.join(__dirname, 'public/data/version.json');

// Функция для чтения и парсинга JSON файла
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Ошибка чтения файла ${filePath}:`, error);
    process.exit(1);
  }
}

// Функция для записи JSON файла
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Файл ${filePath} успешно обновлен`);
  } catch (error) {
    console.error(`Ошибка записи файла ${filePath}:`, error);
    process.exit(1);
  }
}

// Создаем интерфейс для чтения ввода
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Функция запуска деплоя
function runDeploy() {
  console.log('✓ Запускаю деплой...');
  
  // Запускаем деплой хостинга Firebase
  const deployProcess = exec('firebase deploy --only hosting', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Ошибка деплоя: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`❌ Stderr: ${stderr}`);
      return;
    }
    console.log(`✅ Деплой успешно завершен:\n${stdout}`);
  });

  // Выводим вывод процесса деплоя в консоль в реальном времени
  deployProcess.stdout.pipe(process.stdout);
  deployProcess.stderr.pipe(process.stderr);
}

// Функция для проверки времени последнего деплоя
function checkLastDeployTime() {
  try {
    const versionData = readJsonFile(versionPath);
    
    // Проверяем, есть ли информация о времени последнего деплоя
    if (versionData.lastDeployTime) {
      const lastTime = new Date(versionData.lastDeployTime);
      const now = new Date();
      const diffMinutes = (now - lastTime) / (1000 * 60);
      
      // Если прошло меньше 1 минуты с последнего деплоя - просто сообщаем и продолжаем
      if (diffMinutes < 1) {
        console.log(`ℹ️ Информация: Последний деплой был выполнен ${Math.round(diffMinutes * 60)} секунд назад`);
        console.log('ℹ️ Продолжаем без проверки версии...');
        
        // Обновляем только время последнего деплоя, не трогая версию
        versionData.lastDeployTime = new Date().toISOString();
        writeJsonFile(versionPath, versionData);
        
        // Запускаем деплой без дополнительных проверок
        runDeploy();
        process.exit(0); // Выходим после запуска деплоя
      } else {
        // Прошло больше минуты - запускаем полную проверку версии
        console.log(`✓ С момента последнего деплоя прошло ${Math.floor(diffMinutes)} мин ${Math.round((diffMinutes % 1) * 60)} сек`);
        console.log('✓ Запускаю полную проверку версии...');
        
        // Обновляем время последнего деплоя
        versionData.lastDeployTime = new Date().toISOString();
        writeJsonFile(versionPath, versionData);
        
        // Возвращаем false, чтобы продолжить с полной проверкой версии
        return false;
      }
    }
    
    return false; // Нет информации о последнем деплое, продолжаем нормальную проверку
  } catch (error) {
    console.error('Ошибка при проверке времени последнего деплоя:', error);
    return false; // В случае ошибки продолжаем деплой
  }
}

// Функция для проверки наличия значимых заметок о релизе
function hasValidReleaseNotes(releaseData) {
  const { notes } = releaseData;
  
  // Проверка на наличие специального символа "-", который означает "не показывать попап"
  if (notes && 
      Array.isArray(notes) && 
      notes.length === 1 && 
      notes[0] && 
      typeof notes[0] === 'string' && 
      notes[0].trim() === '-') {
    console.log('ℹ️ Обнаружен специальный символ "-" в заметках - попап показываться не будет');
    // При наличии "-" возвращаем специальное значение
    return 'hidden';
  }
  
  // Проверяем строго, что массив не пустой и содержит хотя бы одну непустую строку
  return notes && 
         Array.isArray(notes) && 
         notes.length > 0 && 
         notes.some(note => note && typeof note === 'string' && note.trim() !== '');
}

// Основная функция проверки
async function checkVersion() {
  console.log('✓ Начинаю проверку версии перед деплоем...');
  
  // Проверяем время последнего деплоя
  if (checkLastDeployTime()) {
    rl.close();
    process.exit(0); // Выходим без ошибки, просто пропускаем деплой
  }
  
  // Чтение файлов
  const releaseData = readJsonFile(releasePath);
  const versionData = readJsonFile(versionPath);
  
  // Проверка наличия заметок о релизе
  const hasReleaseNotes = hasValidReleaseNotes(releaseData);
  
  // Выводим информацию о заметках
  if (hasReleaseNotes === 'hidden') {
    console.log('ℹ️ Заметки о релизе: скрытые (используется символ "-")');
  } else {
    console.log(`ℹ️ Заметки о релизе: ${hasReleaseNotes ? 'имеются' : 'отсутствуют'}`);
  }
  
  // Сначала спрашиваем о версии независимо от наличия заметок
  const currentVersion = releaseData.version;
  console.log(`✓ Текущая версия: ${currentVersion}`);
  
  // Предлагаем следующую версию по умолчанию
  const versionParts = currentVersion.split('.').map(part => parseInt(part, 10));
  versionParts[versionParts.length - 1]++;
  const suggestedVersion = versionParts.join('.');
  
  return new Promise((resolve) => {
    const askVersion = () => {
      rl.question(`Укажите версию обновления [${suggestedVersion}]: `, (inputVersion) => {
        const newVersion = inputVersion.trim() || suggestedVersion;
        
        // Проверяем, что новая версия больше текущей
        if (!isVersionGreater(currentVersion, newVersion)) {
          console.error(`❌ Новая версия (${newVersion}) должна быть больше текущей (${currentVersion})!`);
          askVersion(); // Спрашиваем снова
          return;
        }
        
        if (hasReleaseNotes === 'hidden') {
          console.warn('⚠ ПРЕДУПРЕЖДЕНИЕ: В файле release-notes.json указан символ "-".');
          console.warn('⚠ Поп-ап с уведомлением об обновлении НЕ БУДЕТ показан пользователям.');
          
          rl.question('Вы уверены, что хотите продолжить деплой без показа уведомления? (y/n): ', (answer) => {
            if (answer.toLowerCase() !== 'y') {
              console.log('❌ Деплой отменен.');
              rl.close();
              process.exit(1);
            }
            
            // Обновляем версию и запускаем деплой
            updateVersionAndDeploy(newVersion, releaseData, versionData);
            rl.close();
            resolve();
          });
        } else if (!hasReleaseNotes) {
          console.warn('⚠ ПРЕДУПРЕЖДЕНИЕ: В файле release-notes.json не найдены заметки о релизе.');
          console.warn('⚠ Поп-ап с уведомлением об обновлении НЕ БУДЕТ показан пользователям.');
          
          rl.question('Вы уверены, что хотите продолжить деплой без заметок о релизе? (y/n): ', (answer) => {
            if (answer.toLowerCase() !== 'y') {
              console.log('❌ Деплой отменен.');
              rl.close();
              process.exit(1);
            }
            
            // Обновляем версию и запускаем деплой
            updateVersionAndDeploy(newVersion, releaseData, versionData);
            rl.close();
            resolve();
          });
        } else {
          // Обновляем версию и запускаем деплой
          updateVersionAndDeploy(newVersion, releaseData, versionData);
          rl.close();
          resolve();
        }
      });
    };
    
    askVersion();
  });
}

// Функция для проверки, что новая версия больше текущей
function isVersionGreater(currentVersion, newVersion) {
  const currentParts = currentVersion.split('.').map(part => parseInt(part, 10));
  const newParts = newVersion.split('.').map(part => parseInt(part, 10));
  
  for (let i = 0; i < Math.max(currentParts.length, newParts.length); i++) {
    const currentNum = i < currentParts.length ? currentParts[i] : 0;
    const newNum = i < newParts.length ? newParts[i] : 0;
    
    if (newNum > currentNum) return true;
    if (newNum < currentNum) return false;
  }
  
  return false; // Версии равны
}

// Функция для обновления версии и запуска деплоя
function updateVersionAndDeploy(newVersion, releaseData, versionData) {
  console.log(`✓ Устанавливаю новую версию: ${newVersion}`);
  
  // Обновляем версию в обоих файлах
  releaseData.version = newVersion;
  versionData.version = newVersion;
  
  // Добавляем время последнего деплоя
  versionData.lastDeployTime = new Date().toISOString();
  
  // Записываем обновленные файлы
  writeJsonFile(releasePath, releaseData);
  writeJsonFile(versionPath, versionData);
  
  console.log('✓ Версия успешно обновлена.');
  
  // Запускаем деплой
  runDeploy();
}

// Запускаем проверку
checkVersion()
  .catch((error) => {
    console.error('Произошла ошибка при проверке версии:', error);
    if (rl.listenerCount('line') > 0) {
      rl.close();
    }
    process.exit(1);
  });
