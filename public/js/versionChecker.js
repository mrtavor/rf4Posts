// public/js/versionChecker.js

export function startVersionChecker(options = {}) {
    const {
        versionUrl = '/data/version.json',
        checkInterval = 1 * 60 * 1000 // 5 хвилин
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
            return null;
        }
    }

    async function checkForUpdate() {
        const latestVersion = await fetchVersion();
        if (!latestVersion) return;

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

// Додаємо простий автозапуск для відображення версії на всіх сторінках
(function() {
    fetch('/data/version.json?cacheBust=' + Date.now())
      .then(r => r.json())
      .then(data => {
        if (data.version) {
          document.querySelectorAll('.version').forEach(elem => {
            elem.textContent = 'v' + data.version;
          });
        }
      });
})();


// Якщо скрипт підключений напряму, запускаємо автоматично
if (typeof window !== 'undefined') {
    startVersionChecker();
}