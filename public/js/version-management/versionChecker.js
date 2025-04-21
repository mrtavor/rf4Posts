// public/js/version-management/versionChecker.js

export function startVersionChecker(options = {}) {
    const {
        versionUrl = '/data/config/version.json',
        checkInterval = 5 * 60 * 1000 // 5 минут
    } = options;

    let currentVersion = null;

    // Отобразить версию на странице
    function updateVersionDisplay(version) {
        document.querySelectorAll('.version').forEach(elem => {
            elem.textContent = `v${version}`;
        });
    }

    async function fetchVersion() {
        try {
            const response = await fetch(versionUrl + '?cacheBust=' + Date.now());
            if (!response.ok) return null;
            const data = await response.json();
            return data.version || null;
        } catch (e) {
            return null;
        }
    }

    async function checkForUpdate() {
        const latestVersion = await fetchVersion();
        if (!latestVersion) {
            return;
        }

        // Если это первая проверка — обновляем currentVersion и показываем на странице
        if (!currentVersion) {
            currentVersion = latestVersion;
            updateVersionDisplay(currentVersion);
            return;
        }

        // Если версия изменилась — показываем баннер
        if (latestVersion !== currentVersion) {
            showUpdateBanner(latestVersion);
        } else {
            removeUpdateBanner();
        }
    }

    function removeUpdateBanner() {
        const banner = document.getElementById('update-banner');
        if (banner) {
            banner.remove();
        }
    }

    function showUpdateBanner(newVersion) {
        if (document.getElementById('update-banner')) return; // Не дублировать
        const banner = document.createElement('div');
        banner.id = 'update-banner';
        banner.className = 'update-banner'; // Для CSS
        banner.innerHTML = `
            <span class="update-banner-text">Доступно новое обновление сайта!</span>
            <button id="update-btn" class="update-banner-btn">Обновить</button>
        `;
        document.body.appendChild(banner);
    
        document.getElementById('update-btn').onclick = async () => {
            // 1. Удалить все кэши (Cache Storage)
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }
            // 2. Удалить Service Worker (если есть)
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let reg of registrations) {
                    await reg.unregister();
                }
            }
            // 3. Перезагрузить страницу
            window.location.reload(true);
        };
    }

    // Сразу показываем версию при загрузке
    fetchVersion().then(version => {
        if (version) {
            currentVersion = version;
            updateVersionDisplay(version);
        }
    });

    // Проверяем обновления периодически
    setInterval(checkForUpdate, checkInterval);

    return {
        checkForUpdate,
        fetchVersion,
        updateVersionDisplay
    };
}

export function showUpdateBanner(newVersion = 'Тестовая версия') {
    if (document.getElementById('update-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'update-banner';
    banner.className = 'update-banner';
    banner.innerHTML = `
        <span class="update-banner-text">Доступно новое обновление сайта!</span>
        <button id="update-btn" class="update-banner-btn">Обновить</button>
        <button id="hide-banner-btn" class="update-banner-hide-btn" title="Скрыть">×</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('update-btn').onclick = async () => {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let reg of registrations) {
                await reg.unregister();
            }
        }
        window.location.reload(true);
    };

    document.getElementById('hide-banner-btn').onclick = () => {
        banner.style.display = 'none';
    };
}

// Добавляем функцию для немедленного отображения версии
function displayCurrentVersion() {
    fetch('/data/config/version.json?cacheBust=' + Date.now())
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось получить версию');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.version) {
                document.querySelectorAll('.version').forEach(elem => {
                    elem.textContent = 'v' + data.version;
                });
            }
        })
        .catch(error => {
            // Игнорируем ошибку
        });
}

// Если страница уже загружена, отображаем версию
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    displayCurrentVersion();
} else {
    // Иначе ждем загрузки DOM
    document.addEventListener('DOMContentLoaded', displayCurrentVersion);
}

// Автоматически запускаем проверку версии
const versionChecker = startVersionChecker();