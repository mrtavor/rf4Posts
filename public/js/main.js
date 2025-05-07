document.addEventListener('DOMContentLoaded', () => {
    // Отображение версии
    displayCurrentVersion();
    
    document.querySelectorAll('.version').forEach(elem => {
        elem.style.cursor = 'pointer';
        elem.title = 'Просмотреть историю версий';
        elem.onclick = () => {
            window.open('/versions', '_blank');
        };
    });

    // Поддержка URL с /home и /versions
    handleCleanUrls();
});

/**
 * Отображает текущую версию на странице
 */
function displayCurrentVersion() {
    fetch('/data/config/version.json?cacheBust=' + Date.now())
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось получить данные версии');
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

/**
 * Обрабатывает URL-пути для чистых URL
 */
function handleCleanUrls() {
    // Если пользователь находится на домашней странице без /home, перенаправляем
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        // Обновляем URL без перезагрузки страницы
        const newUrl = window.location.origin + '/home';
        window.history.replaceState(null, document.title, newUrl);
    }
    
    // Проверяем страницу versions
    if (window.location.pathname === '/versions_page.html') {
        // Обновляем URL без перезагрузки страницы
        const newUrl = window.location.origin + '/versions';
        window.history.replaceState(null, document.title, newUrl);
    }

    // Проверяем, находится ли пользователь на пути /home и подгружаем домашнюю страницу
    if (window.location.pathname.startsWith('/home')) {
        // Сохраняем правильный URL и загружаем нужные компоненты
    }
    
    // Проверяем, находится ли пользователь на пути /versions
    if (window.location.pathname.startsWith('/versions')) {
        // Отображаем страницу истории версий
    }
}