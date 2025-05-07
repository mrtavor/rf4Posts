(function() {
    // Проверяем, показывали ли уже попап
    if (localStorage.getItem('rf4posts_welcome_shown')) return;

    // Создаем попап
    const popup = document.createElement('div');
    popup.className = 'welcome-popup';
    popup.innerHTML = `
        <div class="welcome-popup-content">
            <h3>Добро пожаловать на наш сайт "Точки ловли"!</h3>
            <p>Здесь вы найдете интерактивные карты с рулеткой, лучшими местами для рыбалки, координаты и реальные посты от игроков.<br>
            Выберите водоем, просмотрите точки, читайте описания и ловите большую рыбу!</p>
            <button class="welcome-popup-ok">ОК</button>
        </div>
    `;
    document.body.appendChild(popup);

    // Закрытие попапа
    popup.querySelector('.welcome-popup-ok').onclick = function() {
        popup.remove();
        localStorage.setItem('rf4posts_welcome_shown', '1');
    };
})();
