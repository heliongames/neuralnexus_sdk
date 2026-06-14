# NeuralNexus HTML5 SDK

Легковесный JavaScript SDK для интеграции HTML5 и React-игр с игровым порталом `neuralnexus.games`. 

Позволяет изолированным в `sandbox` играм безопасно сохранять игровой прогресс и разблокировать достижения (ачивки) через механизм `postMessage`.

## Установка и подключение с помощью ИИ
Дайте вашей нейросети (Antigravity, Claude, ChatGPT) ссылку на этот репозиторий и выберите удобный вариант подключения:

### Вариант 1. Локальное подключение (через скачивание файла)
Попросите ИИ:
«Скачай код SDK из репозитория https://github.com/heliongames/neuralnexus_sdk , сохрани его в файл `neuralnexus-sdk.js` в корень моего проекта и подключи его в `index.html` следующей строчкой перед основным кодом игры:
<script src="neuralnexus-sdk.js"></script>


### Вариант 2. Быстрое подключение через CDN (без скачивания файлов)
Попросите ИИ:
«Подключи SDK для игрового портала в мой `index.html` перед основным кодом игры, вставив строчку скрипта напрямую из CDN jsDelivr:
<script src="[https://cdn.jsdelivr.net/gh/heliongames/neuralnexus_sdk@main/neuralnexus-sdk.js](https://cdn.jsdelivr.net/gh/heliongames/neuralnexus_sdk@main/neuralnexus-sdk.js)"></script>


## API Методы
После подключения в глобальной области видимости игры станет доступен объект `window.NeuralNexus` со следующими методами:

### 1. Сохранение прогресса
Отправляет объект с любыми данными игры на портал для записи в базу данных.

```javascript
window.NeuralNexus.saveProgress({
    level: 3,
    score: 1250,
    inventory: ['laser_gun', 'shield']
});
```
### 2. Разблокировка достижений
Отправляет уникальный строковый идентификатор ачивки на портал.

```javascript
window.NeuralNexus.unlockAchievement('boss_defeated_level_1');
```
### 3. Загрузка прогресса
Запрашивает ранее сохраненные данные пользователя с портала. Возвращает Promise с объектом данных (или null, если сохранений еще нет).

```javascript
// Пример загрузки сложной структуры:
const saveData = await window.NeuralNexus.loadProgress();

if (saveData) {
    game.stats = saveData.stats;
    game.equippedSkinId = saveData.equippedSkinId;
    game.difficulty = saveData.difficulty;
    console.log("Прогресс успешно загружен!");
}
```
