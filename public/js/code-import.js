import { startVersionChecker } from './versionChecker.js';
import { initInactivityCheck } from './inactivityPopup.js';
import { checkReleaseNotes } from './releaseNotesPopup.js';
import { initBackgroundMusic } from './backgroundMusic.js';

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
  
  // Ініціалізація фонової музики
  initBackgroundMusic();
});

import { initZoom } from './mapZoom.js';
import { initDrag } from './mapDrag.js';

initZoom();
initDrag();
