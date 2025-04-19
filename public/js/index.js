function setBackgroundImages() {
    const imageMap = {
        'оз. Комариное': 'komarinoe',
        'р. Вьюнок': 'vyunok',
        'оз. Старый Острог': 'ostrog',
        'р. Белая': 'belaya',
        'оз. Куори': 'kuori',
        'оз. Медвежье': 'medvezhye',
        'р. Волхов': 'volhov',
        'р. Северский Донец': 'donets',
        'р. Сура': 'sura',
        'Ладожское оз.': 'ladoga',
        'оз. Янтарное': 'yantarnoe',
        'Ладожский архипелаг': 'archipelag',
        'р. Ахтуба': 'akhtuba',
        'оз. Медное': 'mednoe',
        'р. Нижняя Тунгуска': 'tunguska',
        'р. Яма': 'yama',
        'Норвежское море': 'norway_sea'
    };

    const gridItems = document.querySelectorAll('.grid-container a');
    
    gridItems.forEach(item => {
        const id = item.id;
        const imageName = imageMap[id];
        if (imageName) {
            const backgroundImage = `images/${imageName}_background.webp`;
            item.style.backgroundImage = `url(${backgroundImage})`;
        }
    });
}

document.addEventListener('DOMContentLoaded', setBackgroundImages);