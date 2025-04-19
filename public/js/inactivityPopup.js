// Поп-ап для обнаружения неактивности пользователя или необходимости обновления версии
import { showUpdateBanner } from './versionChecker.js';

export function initInactivityCheck() {
    // Параметры
    const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 минут в миллисекундах
    const VERSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 минут для проверки версии
    const FIRST_VISIT_KEY = 'rf4posts_first_visit';
    
    let inactivityTimer;
    let loadTime = Date.now();
    let currentVersion = null;
    let serverVersion = null;
    let isFirstVisit = checkIfFirstVisit();
    
    // Функция для проверки, является ли это первым визитом пользователя
    function checkIfFirstVisit() {
        const firstVisit = localStorage.getItem(FIRST_VISIT_KEY);
        if (!firstVisit) {
            // Если это первый визит, сохраняем текущее время в localStorage
            localStorage.setItem(FIRST_VISIT_KEY, Date.now().toString());
            return true;
        }
        return false;
    }
    
    // Получаем текущую версию при загрузке
    fetchCurrentVersion();
    
    // Проверяем версию каждые 5 минут
    const versionCheckInterval = setInterval(checkVersion, VERSION_CHECK_INTERVAL);
    
    // Сбрасываем таймер неактивности при взаимодействии пользователя
    resetInactivityTimer();
    
    // Добавляем слушатели событий для отслеживания активности пользователя
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
        document.addEventListener(event, resetInactivityTimer);
    });
    
    // Функция для сброса таймера неактивности
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(onInactivity, INACTIVITY_TIMEOUT);
    }
    
    // Функция, которая выполняется при неактивности пользователя
    function onInactivity() {
        if (!isFirstVisit && serverVersion && currentVersion && serverVersion !== currentVersion) {
            showUpdatePopup();
        }
    }
    
    // Проверка, прошло ли 5 минут с момента загрузки страницы без перезагрузки
    function checkVersion() {
        fetchCurrentVersion();
        
        const timeElapsed = Date.now() - loadTime;
        if (timeElapsed >= VERSION_CHECK_INTERVAL) {
            if (!isFirstVisit && serverVersion && currentVersion && serverVersion !== currentVersion) {
                showUpdatePopup();
            }
        }
    }
    
    // Получить текущую версию с сервера
    async function fetchCurrentVersion() {
        try {
            const response = await fetch('/data/version.json?cacheBust=' + Date.now());
            if (!response.ok) return;
            
            const data = await response.json();
            serverVersion = data.version;
            
            if (!currentVersion) {
                currentVersion = serverVersion;
            }
        } catch (error) {
            // Ошибка получения версии
        }
    }
    
    // Показать поп-ап для обновления
    function showUpdatePopup() {
        if (document.getElementById('update-popup')) return; // Проверка, показан ли уже
        
        const popup = document.createElement('div');
        popup.id = 'update-popup';
        popup.className = 'update-popup';
        popup.innerHTML = `
            <div class="update-popup-content">
                <h3>Доступна новая версия сайта</h3>
                <p>Для использования последних функций и исправлений необходимо обновить страницу.</p>
                <p class="cache-tip">Для полного обновления сайта нужно очистить кеш. Вы можете использовать сочетание клавиш <strong>Ctrl+Shift+R</strong>.</p>
                <div class="update-popup-buttons">
                    <button id="update-now-btn" class="update-popup-btn primary">Обновить сейчас</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Добавляем стиль для подсказки о кеше
        const style = document.createElement('style');
        style.textContent = `
            .cache-tip {
                font-size: 14px;
                color: #666;
                margin-bottom: 20px;
                padding: 8px;
                background-color: #f8f8f8;
                border-radius: 4px;
                border-left: 3px solid rgb(169, 209, 236);
            }
            .cache-tip strong {
                font-weight: bold;
                background-color: #f0f0f0;
                padding: 2px 4px;
                border-radius: 3px;
                border: 1px solid #ddd;
            }
        `;
        document.head.appendChild(style);
        
        // Кнопка "Обновить сейчас"
        document.getElementById('update-now-btn').onclick = async () => {
            // Удалить все кэши
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }
            
            // Удалить Service Worker
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let reg of registrations) {
                    await reg.unregister();
                }
            }
            
            // Небольшая задержка для удаления кеша
            setTimeout(() => {
                // Перезагрузить страницу с полным обновлением кеша
                window.location.reload(true);
            }, 300);
        };
    }
}

// Автоматически запускаем проверку при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initInactivityCheck();
}); 