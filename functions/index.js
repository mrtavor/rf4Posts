const { onSchedule } = require('firebase-functions/v2/scheduler');
const { main } = require('./vk_parser');

exports.parseVK = onSchedule({ schedule: 'every 20 minutes' }, async (event) => {
  await main();
}); 
