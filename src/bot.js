const weather = require('./weather');
const cityManager = require('./cityManager');
const stateManager = require('./stateManager');

bot.onText(/\\/start/, async (msg) => {
    const welcomeMessage = "Welcome to the Weather Bot! Use the commands below to interact:\\n" +
    "/setCity - Set your preferred city for weather updates.\\n" +
    "/getWeather - Get instant weather information for any city.\\n";
    await bot.sendMessage(msg.chat.id, welcomeMessage);
    stateManager.ensureUserState(msg.chat.id);
});
bot.onText(/\\/getWeather$/, async (msg) => {
    stateManager.setUserState(msg.chat.id, { expect: 'GET_WEATHER' });
    bot.sendMessage(msg.chat.id, "Which city do you want to get weather information for?");
});
// Handle incoming messages
bot.on('message', async (msg) => {
    if (msg.text.startsWith('/')) {
        // If the message is a command, reset the user state
        stateManager.resetUserState(msg.chat.id);
    } else {
        // If it's not a command, check user state
        const state = await stateManager.getUserState(msg.chat.id);
        if (state && state.expect === 'SET_CITY') {
            // If expecting SET_CITY, set city and reset state
            const city = msg.text;
            cityManager.setCity(msg.chat.id, city);
            bot.sendMessage(msg.chat.id, `City set to ${city}. You will receive weather updates every 2 minutes.`);
            stateManager.resetUserState(msg.chat.id);
        } else if (state && state.expect === 'GET_WEATHER') {
            // If expecting GET_WEATHER, get weather and reset state
            const city = msg.text;
            weather.getWeather(city).then(response => {
                bot.sendMessage(msg.chat.id, response);
            }).catch(error => {
                bot.sendMessage(msg.chat.id, "Failed to retrieve weather.");
            });
            stateManager.resetUserState(msg.chat.id);
        }
    }
});

// Initialize the init function from cityManager.js for regular weather updates
cityManager.init(bot);