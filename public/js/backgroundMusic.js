// Управление фоновой музыкой на сайте

let audioPlayer = null;
let isPlaying = false;
let volume = 0.3; // Громкость по умолчанию (30%)
let musicTrack = 'sounds/background-music.mp3'; // Путь к файлу музыки
let currentTrackIndex = 0;

// Список доступных треков
const musicTracks = [
    'sounds/background-music.mp3'
];

// Инициализация музыкального плеера
export function initBackgroundMusic() {
    // Создаем аудио-элемент
    audioPlayer = new Audio(musicTrack);
    audioPlayer.loop = true; // Зацикливаем воспроизведение
    audioPlayer.volume = volume;
    
    // Создаем элементы управления музыкой
    createMusicControls();
    
    // Обработка автозапуска (по закону должен быть старт после взаимодействия)
    document.addEventListener('click', function firstInteraction() {
        if (!isPlaying) {
            toggleMusic();
        }
        // Удаляем обработчик после первого взаимодействия
        document.removeEventListener('click', firstInteraction);
    }, { once: true });
}

// Создание элементов управления музыкой
function createMusicControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'music-controls';
    controlsContainer.style.position = 'fixed';
    controlsContainer.style.bottom = '20px';
    controlsContainer.style.left = '20px';
    controlsContainer.style.zIndex = '999';
    controlsContainer.style.display = 'flex';
    controlsContainer.style.alignItems = 'center';
    controlsContainer.style.gap = '10px';
    controlsContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    controlsContainer.style.padding = '5px 10px';
    controlsContainer.style.borderRadius = '20px';
    controlsContainer.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    
    // Кнопка воспроизведения/паузы
    const toggleButton = document.createElement('button');
    toggleButton.className = 'music-toggle-btn';
    toggleButton.innerHTML = '&#9658;'; // Символ Play
    toggleButton.style.width = '30px';
    toggleButton.style.height = '30px';
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.border = '2px solid #9d816a';
    toggleButton.style.backgroundColor = 'rgb(236, 205, 169)';
    toggleButton.style.color = '#4a3e33';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.display = 'flex';
    toggleButton.style.justifyContent = 'center';
    toggleButton.style.alignItems = 'center';
    toggleButton.title = 'Включить/выключить музыку';
    
    // Регулятор громкости
    const volumeControl = document.createElement('input');
    volumeControl.type = 'range';
    volumeControl.min = '0';
    volumeControl.max = '1';
    volumeControl.step = '0.01';
    volumeControl.value = volume;
    volumeControl.className = 'music-volume';
    volumeControl.style.width = '80px';
    volumeControl.title = 'Громкость';
    
    // Кнопка следующего трека
    const nextButton = document.createElement('button');
    nextButton.className = 'music-next-btn';
    nextButton.innerHTML = '&#9197;'; // Символ Next
    nextButton.style.width = '30px';
    nextButton.style.height = '30px';
    nextButton.style.borderRadius = '50%';
    nextButton.style.border = '2px solid #9d816a';
    nextButton.style.backgroundColor = 'rgb(236, 205, 169)';
    nextButton.style.color = '#4a3e33';
    nextButton.style.cursor = 'pointer';
    nextButton.style.display = 'flex';
    nextButton.style.justifyContent = 'center';
    nextButton.style.alignItems = 'center';
    nextButton.title = 'Следующий трек';
    
    // Добавляем обработчики событий
    toggleButton.addEventListener('click', () => {
        toggleMusic();
        updateToggleButton(toggleButton);
    });
    
    volumeControl.addEventListener('input', (e) => {
        volume = parseFloat(e.target.value);
        if (audioPlayer) {
            audioPlayer.volume = volume;
        }
    });
    
    nextButton.addEventListener('click', () => {
        playNextTrack();
        updateToggleButton(toggleButton);
    });
    
    // Добавляем элементы в контейнер
    controlsContainer.appendChild(toggleButton);
    controlsContainer.appendChild(volumeControl);
    controlsContainer.appendChild(nextButton);
    
    // Добавляем контейнер на страницу
    document.body.appendChild(controlsContainer);
}

// Обновление внешнего вида кнопки play/pause
function updateToggleButton(button) {
    if (isPlaying) {
        button.innerHTML = '&#10074;&#10074;'; // Символ Pause
    } else {
        button.innerHTML = '&#9658;'; // Символ Play
    }
}

// Воспроизведение/пауза музыки
function toggleMusic() {
    if (!audioPlayer) return;
    
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        // Повторно создаем источник в случае, если браузер отменил предыдущее воспроизведение
        if (audioPlayer.paused && audioPlayer.currentTime > 0) {
            audioPlayer.currentTime = 0;
        }
        audioPlayer.play().catch(() => {
            // Обработка ошибки воспроизведения
        });
    }
    
    isPlaying = !isPlaying;
}

// Переключение на следующий трек
function playNextTrack() {
    if (!audioPlayer) return;
    
    currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
    musicTrack = musicTracks[currentTrackIndex];
    
    const wasPlaying = isPlaying;
    
    // Создаем новый аудио-элемент
    audioPlayer.pause();
    audioPlayer = new Audio(musicTrack);
    audioPlayer.volume = volume;
    audioPlayer.loop = true;
    
    if (wasPlaying) {
        audioPlayer.play().catch(() => {
            // Обработка ошибки воспроизведения
        });
        isPlaying = true;
    } else {
        isPlaying = false;
    }
}

// Автоматически запускаем фоновую музыку при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initBackgroundMusic();
}); 