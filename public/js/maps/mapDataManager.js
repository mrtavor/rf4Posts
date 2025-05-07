/**
 * Модуль для управления данными карт и их координатами
 * Позволяет легко получать данные различных карт и их параметры
 */

import { mapsData } from './mapsData.js';

// Класс для управления данными карт
class MapDataManager {
  constructor() {
    this.mapsData = mapsData; // Базовые данные карт (названия, изображения)
    this.mapJsonData = null; // Данные координат (из maps_data.json)
    this.initialized = false; // Флаг инициализации
  }

  /**
   * Инициализирует менеджер данных карт, загружая координаты
   * @returns {Promise<boolean>} Успешность инициализации
   */
  async initialize() {
    if (this.initialized) return true;
    
    try {
      // Загружаем данные карт
      this.mapJsonData = await this.loadMapData();
      this.initialized = true;
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Загружает данные координат карт из JSON файла
   * @returns {Promise<Array>} Массив данных карт
   */
  async loadMapData() {
    // Определяем все возможные пути к файлу
    const possiblePaths = [
      '/data/map-data/maps_data.json',
      './data/map-data/maps_data.json',
      '../data/map-data/maps_data.json',
      '../../data/map-data/maps_data.json',
      window.location.origin + '/data/map-data/maps_data.json'
    ];
    
    // Перебираем пути пока не загрузим данные
    for (let i = 0; i < possiblePaths.length; i++) {
      const currentPath = possiblePaths[i];
      try {
        const response = await fetch(currentPath);
        
        if (!response.ok) {
          continue;
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      } catch (err) {
        // Игнорируем ошибку и продолжаем
      }
    }
    
    return []; // возвращаем пустой массив в случае неудачи
  }

  /**
   * Возвращает ключ карты из URL
   * @returns {string} Ключ карты
   */
  getMapKeyFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('title') || '';
  }

  /**
   * Нормализует название для сравнения
   * @param {string} name - Название для нормализации
   * @returns {string} Нормализованное название
   */
  normalizeMapName(name) {
    if (!name) return '';
    // Удаляем все пробелы, переводим в нижний регистр и удаляем спецсимволы
    return name.toLowerCase().replace(/[^а-яa-z0-9]/g, '');
  }

  /**
   * Получает данные карты по ключу
   * @param {string} mapKey - Ключ карты (из URL)
   * @returns {Object|null} Объект с данными карты или null
   */
  getMapData(mapKey = null) {
    if (!this.initialized) {
      return null;
    }
    
    // Если ключ не передан, берем его из URL
    const key = mapKey || this.getMapKeyFromUrl();
    
    if (!key || !this.mapsData[key]) {
      return null;
    }
    
    // Получаем полное название карты
    const fullMapName = this.mapsData[key].name;
    
    // Нормализуем название для поиска
    const normalizedName = this.normalizeMapName(fullMapName);
    
    // Выводим все имеющиеся карты для диагностики
    const allMapNames = [];
    
    // Сначала ищем точное совпадение
    let mapData = this.mapJsonData.find(item => item.name === fullMapName);
    
    // Если точное совпадение не найдено, ищем по нормализованному названию
    if (!mapData) {
      mapData = this.mapJsonData.find(item => this.normalizeMapName(item.name) === normalizedName);
    }
    
    // Ищем по частичному вхождению названия, если предыдущие поиски не дали результатов
    if (!mapData) {
      const mapNameWithoutPrefix = fullMapName.replace(/^.*?\s/, ''); // Удаляем префикс (оз., р., и т.д.)
      mapData = this.mapJsonData.find(item => item.name.includes(mapNameWithoutPrefix));
    }
    
    // Значение squareSize по умолчанию для каждой карты
    const defaultSizes = {
      'komarinoe': 37,
      'vyunok': 44,
      'ostrog': 40,
      'belaya': 50,
      'kuori': 45,
      'medvezhye': 42,
      'volhov': 100,
      'donets': 87,
      'sura': 78,
      'ladoga': 45,
      'yantarnoe': 90,
      'archipelag': 300,
      'akhtuba': 99,
      'mednoe': 25,
      'tunguska': 120,
      'yama': 150,
      'norwezhskoe': 500
    };
    
    // Данные по умолчанию, если карту не найдено
    if (!mapData) {
      // Получаем базовые координаты и размер квадрата
      let left_top, right_bottom, squareSize;
      
      // Устанавливаем размер квадрата по умолчанию
      squareSize = defaultSizes[key] || 37;
      
      // Устанавливаем базовые координаты в соответствии с картой
      if (key === 'sura') {
        left_top = [-5, 165];
        right_bottom = [163, -2];
      } else if (key === 'volhov') {
        left_top = [-7, 208];
        right_bottom = [210, -9];
      } else if (key === 'norwezhskoe') {
        left_top = [-39, 1037];
        right_bottom = [1037, -41];
      } else if (key === 'archipelag') {
        left_top = [-24, 625];
        right_bottom = [625, -26];
      } else {
        // Для других карт используем стандартные координаты
        left_top = [0, 100];
        right_bottom = [100, 0];
      }
      
      return {
        key,
        title: fullMapName,
        image: this.mapsData[key].image,
        mapKey: this.mapsData[key].map,
        name: fullMapName,
        game_coords: {
          left_top: left_top,
          right_bottom: right_bottom,
          squareSize: squareSize
        },
        mouse_coords: {
          left_top: left_top,
          right_bottom: right_bottom
        }
      };
    }
    
    // Проверяем и исправляем данные карты
    
    // Создаем глубокую копию чтобы не изменять оригинальные данные
    const fixedData = JSON.parse(JSON.stringify(mapData));
    
    // Убеждаемся, что структура game_coords существует
    if (!fixedData.game_coords) {
      fixedData.game_coords = {};
    }
    
    // Убеждаемся, что структура mouse_coords существует
    if (!fixedData.mouse_coords) {
      fixedData.mouse_coords = fixedData.game_coords;
    }
    
    // Устанавливаем размер квадрата, если отсутствует
    if (!fixedData.game_coords.squareSize && !fixedData.game_coords.square_size) {
      fixedData.game_coords.squareSize = defaultSizes[key] || 37;
    }
    
    mapData = fixedData;
    
    // Возвращаем полный объект данных
    return {
      key,                // Ключ карты (из URL)
      title: fullMapName, // Полное название карты
      image: this.mapsData[key].image, // Путь к изображению
      mapKey: this.mapsData[key].map,  // Ключ карты для Firestore
      ...mapData          // Данные координат и размеров
    };
  }

  /**
   * Получает размер квадрата для указанной карты
   * @param {string} mapKey - Ключ карты (из URL)
   * @returns {number} Размер квадрата в метрах или значение по умолчанию
   */
  getSquareSize(mapKey = null) {
    // Если это Сура, возвращаем правильное значение напрямую
    if (mapKey === 'sura' || this.getMapKeyFromUrl() === 'sura') {
      return 78;
    }
    
    const mapData = this.getMapData(mapKey);
    
    // Обновляем логику получения squareSize
    if (mapData) {
      if (mapData.game_coords && typeof mapData.game_coords.squareSize !== 'undefined') {
        return mapData.game_coords.squareSize;
      } else if (mapData.game_coords && mapData.game_coords.square_size) {
        return mapData.game_coords.square_size;
      } else if (mapData.squareSize) {
        return mapData.squareSize;
      }
    }
    
    // Карта-специфичные значения по умолчанию
    const defaultSizes = {
      'sura': 78,
      'volhov': 100,
      'ladoga': 45,
      'belaya': 50,
      'ostrog': 40,
      'komarinoe': 37
    };
    
    const key = mapKey || this.getMapKeyFromUrl();
    if (defaultSizes[key]) {
      return defaultSizes[key];
    }
    
    // Общее значение по умолчанию
    return 37;
  }
  
  /**
   * Конвертирует координаты игры в пиксели на изображении
   * @param {Object} coords - {x, y} координаты в игре
   * @param {string} mapKey - Ключ карты
   * @param {string} imageId - ID элемента изображения
   * @returns {Object|null} {x, y} координаты в пикселях или null
   */
  gameCoordsToPixels(coords, mapKey = null, imageId = 'image') {
    const mapData = this.getMapData(mapKey);
    const img = document.getElementById(imageId);
    
    if (!mapData || !img || !mapData.game_coords) return null;
    
    const rect = img.getBoundingClientRect();
    const { left_top, right_bottom } = mapData.game_coords;
    
    const minX = left_top[0];
    const maxX = right_bottom[0];
    const maxY = left_top[1];
    const minY = right_bottom[1];
    
    const mapWidth = rect.width;
    const mapHeight = rect.height;
    
    const scaleX = mapWidth / (maxX - minX);
    const scaleY = mapHeight / (maxY - minY);
    
    const x_pixel = ((coords.x) - minX) * scaleX;
    const y_pixel = mapHeight - ((coords.y) - minY) * scaleY;
    
    return { x: x_pixel, y: y_pixel };
  }
  
  /**
   * Конвертирует координаты мыши в координаты игры
   * @param {Event} event - Событие мыши
   * @param {string} mapKey - Ключ карты
   * @param {string} imageId - ID элемента изображения
   * @returns {Object|null} {x, y} координаты в игре или null
   */
  pixelsToGameCoords(event, mapKey = null, imageId = 'image') {
    const mapData = this.getMapData(mapKey);
    const img = document.getElementById(imageId);
    
    if (!mapData || !img || !mapData.mouse_coords) return null;
    
    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const { left_top, right_bottom } = mapData.mouse_coords;
    
    const minX = left_top[0];
    const maxX = right_bottom[0];
    const maxY = left_top[1];
    const minY = right_bottom[1];
    
    const mapWidth = rect.width;
    const mapHeight = rect.height;
    
    const gameX = minX + (x / mapWidth) * (maxX - minX);
    const gameY = minY + ((mapHeight - y) / mapHeight) * (maxY - minY);
    
    return { x: gameX, y: gameY };
  }
  
  /**
   * Рассчитывает расстояние в метрах между двумя точками
   * @param {Object} point1 - {x, y} первая точка в пикселях
   * @param {Object} point2 - {x, y} вторая точка в пикселях 
   * @param {string} mapKey - Ключ карты
   * @returns {number} Расстояние в метрах
   */
  calculateDistance(point1, point2, mapKey = null) {
    const squareSize = this.getSquareSize(mapKey);
    const mapData = this.getMapData(mapKey);
    
    if (!mapData) return 0;
    
    // Получаем размеры изображения
    const img = document.getElementById('image');
    if (!img) return 0;
    
    const rect = img.getBoundingClientRect();
    
    // Расчет расстояния в пикселях
    const pixelDistance = Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + 
      Math.pow(point2.y - point1.y, 2)
    );
    
    // Эффективный размер карты в пикселях
    const effectiveMapSize = Math.min(rect.width, rect.height);
    
    // Размер одного квадрата в пикселях (карта 10x10 квадратов)
    const pixelsPerSquare = effectiveMapSize / 10;
    
    // Коэффициент преобразования пикселей в метры
    const metersPerPixel = squareSize / pixelsPerSquare;
    
    // Расстояние в метрах
    const distanceInMeters = pixelDistance * metersPerPixel;
    
    return Math.round(distanceInMeters);
  }
}

// Создаем и экспортируем единственный экземпляр менеджера
const mapManager = new MapDataManager();

// Экспортируем как модуль
export default mapManager; 