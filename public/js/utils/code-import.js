import { startVersionChecker } from '../version-management/versionChecker.js';
import { initInactivityCheck } from '../components/inactivityPopup.js';
import { checkReleaseNotes } from '../components/releaseNotesPopup.js';

// Инициализируем основные функции
document.addEventListener('DOMContentLoaded', () => {
  // Стандартная проверка версии
  startVersionChecker({
    checkInterval: 5 * 60 * 1000 // 5 минут
  });
  
  // Проверка неактивности и необходимости обновления
  initInactivityCheck();
  
  // Проверка новых примечаний к релизу
  checkReleaseNotes();
});