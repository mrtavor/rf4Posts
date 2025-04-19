// public/js/version-management/versionChecker.js

export function startVersionChecker(options = {}) {
    const {
        versionUrl = '/data/config/version.json',
        checkInterval = 5 * 60 * 1000 // 5 хвилин
    } = options;

    let currentVersion = null;

    // Відобразити версію на сторінці
    function updateVersionDisplay(version) {
        console.log('Відображаємо версію:', version);
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
            console.error('Помилка при отриманні версії:', e);
            return null;
        }
    }

    async function checkForUpdate() {
        const latestVersion = await fetchVersion();
        if (!latestVersion) {
            console.error('Не вдалося отримати версію');
            return;
        }

        // Якщо це перша перевірка — оновлюємо currentVersion і показуємо на сторінці
        if (!currentVersion) {
            currentVersion = latestVersion;
            updateVersionDisplay(currentVersion);
            return;
        }

        // Якщо версія змінилась — показуємо банер
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
        if (document.getElementById('update-banner')) return; // Не дублювати
        const banner = document.createElement('div');
        banner.id = 'update-banner';
        banner.className = 'update-banner'; // Для CSS
        banner.innerHTML = `
            <span class="update-banner-text">Доступне нове оновлення сайту!</span>
            <button id="update-btn" class="update-banner-btn">Оновити</button>
        `;
        document.body.appendChild(banner);
    
        document.getElementById('update-btn').onclick = async () => {
            // 1. Видалити всі кеші (Cache Storage)
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }
            // 2. Видалити Service Worker (якщо є)
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let reg of registrations) {
                    await reg.unregister();
                }
            }
            // 3. Перезавантажити сторінку
            window.location.reload(true);
        };
    }

    // Одразу показуємо версію при завантаженні
    fetchVersion().then(version => {
        if (version) {
            currentVersion = version;
            updateVersionDisplay(version);
        }
    });

    // Перевіряємо оновлення періодично
    setInterval(checkForUpdate, checkInterval);

    return {
        checkForUpdate,
        fetchVersion,
        updateVersionDisplay
    };
}

export function showUpdateBanner(newVersion = 'Тестова версія') {
    if (document.getElementById('update-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'update-banner';
    banner.className = 'update-banner';
    banner.innerHTML = `
        <span class="update-banner-text">Доступно новое обновление сайта!</span>
        <button id="update-btn" class="update-banner-btn">Оновити</button>
        <button id="hide-banner-btn" class="update-banner-hide-btn" title="Сховати">×</button>
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

// Додаємо функцію для негайного відображення версії
function displayCurrentVersion() {
    fetch('/data/config/version.json?cacheBust=' + Date.now())
        .then(response => {
            if (!response.ok) {
                throw new Error('Не вдалося отримати версію');
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
            console.error('Помилка при отриманні версії:', error);
        });
}

// Якщо сторінка вже завантажена, відображаємо версію
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    displayCurrentVersion();
} else {
    // Інакше чекаємо завантаження DOM
    document.addEventListener('DOMContentLoaded', displayCurrentVersion);
}

// Автоматично запускаємо перевірку версії
const versionChecker = startVersionChecker();