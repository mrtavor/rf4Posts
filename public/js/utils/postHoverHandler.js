// Функция для подключения hover-эффекта ко всем постам
export function enablePostHoverHighlight(postsContainer) {
    // Все посты
    const postDivs = postsContainer.querySelectorAll('.post');

    postDivs.forEach(postDiv => {
        // Находим координаты из DOM
        const coordsText = postDiv.querySelector('.post-body > div:nth-child(2)');
        if (!coordsText) return;

        // Извлекаем координаты из текста (например, "Координаты: 120:45")
        const match = coordsText.textContent.match(/(\d{1,3})[:,\s](\d{1,3})/);
        if (!match) return;
        const x = match[1];
        const y = match[2];

        // Наведение
        postDiv.addEventListener('mouseenter', () => {
            // Находим соответствующий круг на карте
            const dot = document.querySelector(`.map-dot[data-coord-x="${x}"][data-coord-y="${y}"]`);
            if (dot) dot.classList.add('active');
        });

        // Уход мыши
        postDiv.addEventListener('mouseleave', () => {
            const dot = document.querySelector(`.map-dot[data-coord-x="${x}"][data-coord-y="${y}"]`);
            if (dot) dot.classList.remove('active');
        });
    });
}
