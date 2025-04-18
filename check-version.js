const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, 'public', 'data', 'version.json');

// Зчитуємо поточну версію
const versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
const currentVersion = versionData.version;

// Отримуємо нову версію з аргументу командного рядка
const newVersion = process.argv[2];

if (!newVersion) {
    console.error('❌ Вкажіть нову версію як аргумент: node check-version.js 1.0.3');
    process.exit(1);
}

// Функція для порівняння версій
function compareVersions(a, b) {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const na = pa[i] || 0;
        const nb = pb[i] || 0;
        if (na > nb) return 1;
        if (na < nb) return -1;
    }
    return 0;
}

const cmp = compareVersions(newVersion, currentVersion);

if (cmp <= 0) {
    console.error(`❌ Нова версія (${newVersion}) має бути більшою за поточну (${currentVersion})!`);
    console.error('💡 Підказка: Запусти деплой так — node check-version.js <НОВА_ВЕРСІЯ> && firebase deploy --only hosting');
    process.exit(1);
}

// Оновлюємо версію у файлі
versionData.version = newVersion;
fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2));
console.log(`✅ Версію оновлено на ${newVersion}`);
