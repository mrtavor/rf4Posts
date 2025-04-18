document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.version').forEach(elem => {
        elem.style.cursor = 'pointer';
        elem.title = 'Просмотреть историю версий';
        elem.onclick = () => {
            window.open('versions.html', '_blank');
        };
    });
});