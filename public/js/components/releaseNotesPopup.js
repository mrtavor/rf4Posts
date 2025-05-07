// Поп-ап с информацией об обновлении после деплоя

// Функция для проверки нужно ли показывать поп-ап с информацией
export function checkReleaseNotes() {
    const VERSION_STORAGE_KEY = 'rf4posts_last_seen_version';
    
    // Получаем версию и примечания к релизу
    fetch('data/config/release-notes.json?cacheBust=' + Date.now())
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось получить примечания к релизу');
            }
            return response.json();
        })
        .then(data => {
            const { version, notes, details_url } = data;
            const lastSeenVersion = localStorage.getItem(VERSION_STORAGE_KEY);
            
            // Проверяем наличие заметок о релизе
            // Проверяем строго, что массив не пустой и содержит непустые строки
            // При этом игнорируем специальный символ "-", который означает "не показывать попап"
            const hasReleaseNotes = notes && 
                                   Array.isArray(notes) && 
                                   notes.length > 0 && 
                                   notes.some(note => {
                                       // Проверяем, что заметка не пустая и не равна "-"
                                       return note && 
                                              typeof note === 'string' && 
                                              note.trim() !== '' && 
                                              note.trim() !== '-';
                                   });
            
            // Специальная проверка на наличие символа "-"
            const hasDashOnly = notes && 
                               Array.isArray(notes) && 
                               notes.length === 1 && 
                               notes[0] && 
                               typeof notes[0] === 'string' && 
                               notes[0].trim() === '-';
            
            // Обновляем версию в локальном хранилище в любом случае
            if (version && (!lastSeenVersion || lastSeenVersion !== version)) {
                localStorage.setItem(VERSION_STORAGE_KEY, version);
            }
            
            // Показываем попап только если:
            // 1. Версия изменилась или попап еще не показывался для текущей версии
            // 2. Есть непустые заметки о релизе
            // 3. В заметках нет символа "-"
            if (version && (!lastSeenVersion || lastSeenVersion !== version) && hasReleaseNotes && !hasDashOnly) {
                showReleaseNotesPopup(version, notes, details_url);
            }
        })
        .catch(error => {
            // Игнорируем ошибку
        });
}

// Функция для отображения поп-апа с примечаниями к релизу
function showReleaseNotesPopup(version, notes, detailsUrl) {
    if (document.getElementById('release-notes-popup')) return;
    
    // Создаем поп-ап
    const popup = document.createElement('div');
    popup.id = 'release-notes-popup';
    popup.className = 'release-notes-popup';
    
    // Фильтруем заметки, исключая пустые строки и символ "-"
    const validNotes = notes.filter(note => 
        note && 
        typeof note === 'string' && 
        note.trim() !== '' && 
        note.trim() !== '-'
    );
    
    // Создаем HTML для списка примечаний
    let notesHtml = '';
    if (validNotes.length > 0) {
        notesHtml = '<ul class="release-notes-list">';
        validNotes.forEach(note => {
            notesHtml += `<li>${note}</li>`;
        });
        notesHtml += '</ul>';
    } else {
        notesHtml = '<p>Обновлено до версии ' + version + '</p>';
    }
    
    // Наполняем поп-ап
    popup.innerHTML = `
        <div class="release-notes-content">
            <h3>Обновление сайта <span class="version-tag">v${version}</span></h3>
            <div class="release-notes-body">
                ${notesHtml}
            </div>
            <div class="release-notes-buttons">
                <button id="release-notes-ok" class="release-notes-btn ok-btn">ОК</button>
                ${detailsUrl ? `<button id="release-notes-more" class="release-notes-btn more-btn">Подробнее</button>` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Обработчики событий для кнопок
    document.getElementById('release-notes-ok').addEventListener('click', () => {
        popup.remove();
    });
    
    if (detailsUrl) {
        document.getElementById('release-notes-more').addEventListener('click', () => {
            window.open(detailsUrl, '_blank');
            popup.remove();
        });
    }
}

// Автоматически проверяем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        checkReleaseNotes();
    }, 1000); // Задержка в 1 секунду для загрузки основного контента
}); 