const schedule = require('node-schedule');
const weather = require('./weather');

let userCities = {};

function setCity(chatId, city) {
  userCities[chatId] = city;
}

function init(bot) {
  schedule.scheduleJob('0 */6 * * *', function() {
    for (let chatId in userCities) {
      const city = userCities[chatId];
      weather.getWeather(city).then(response => {
        bot.sendMessage(chatId, response);
      }).catch(error => {
        bot.sendMessage(chatId, "Failed to retrieve weather.");
      });
    }
  });
}

module.exports = { setCity, init };