document.addEventListener('DOMContentLoaded', () => {
    // Відображення версії
    displayCurrentVersion();
    
    document.querySelectorAll('.version').forEach(elem => {
        elem.style.cursor = 'pointer';
        elem.title = 'Просмотреть историю версий';
        elem.onclick = () => {
            window.open('/versions', '_blank');
        };
    });

    // Підтримка URL з /home і /versions
    handleCleanUrls();
});

/**
 * Відображає поточну версію на сторінці
 */
function displayCurrentVersion() {
    fetch('/data/config/version.json?cacheBust=' + Date.now())
        .then(response => {
            if (!response.ok) {
                throw new Error('Не вдалося отримати дані версії');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.version) {
                document.querySelectorAll('.version').forEach(elem => {
                    elem.textContent = 'v' + data.version;
                    console.log('Версія встановлена:', data.version);
                });
            } else {
                console.error('Дані версії не містять поля version');
            }
        })
        .catch(error => {
            console.error('Помилка при отриманні версії:', error);
        });
}

/**
 * Обробляє URL-шляхи для чистих URL
 */
function handleCleanUrls() {
    // Якщо користувач знаходиться на домашній сторінці без /home, перенаправляємо
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        // Оновлюємо URL без перезавантаження сторінки
        const newUrl = window.location.origin + '/home';
        window.history.replaceState(null, document.title, newUrl);
    }
    
    // Перевіряємо сторінку versions
    if (window.location.pathname === '/versions_page.html') {
        // Оновлюємо URL без перезавантаження сторінки
        const newUrl = window.location.origin + '/versions';
        window.history.replaceState(null, document.title, newUrl);
    }

    // Перевіряємо, чи знаходиться користувач на шляху /home і підвантажуємо домашню сторінку
    if (window.location.pathname.startsWith('/home')) {
        // Зберігаємо правильний URL та завантажуємо потрібні компоненти
        console.log('Відображення домашньої сторінки через шлях /home');
    }
    
    // Перевіряємо, чи знаходиться користувач на шляху /versions
    if (window.location.pathname.startsWith('/versions')) {
        console.log('Відображення сторінки історії версій через шлях /versions');
    }
}