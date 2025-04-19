import { startVersionChecker } from '../version-management/versionChecker.js';
import { initInactivityCheck } from '../components/inactivityPopup.js';
import { checkReleaseNotes } from '../components/releaseNotesPopup.js';

// Ініціалізуємо основні функції
document.addEventListener('DOMContentLoaded', () => {
  // Стандартна перевірка версії
  startVersionChecker({
    checkInterval: 5 * 60 * 1000 // 5 хвилин
  });
  
  // Перевірка неактивності та необхідності оновлення
  initInactivityCheck();
  
  // Перевірка нових приміток до релізу
  checkReleaseNotes();
});