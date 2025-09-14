const axios = require('axios');
const apiKey = process.env.OPENWEATHERMAP_TOKEN;

async function getWeather(city) {3
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    const temp = response.data.main.temp;  
    const description = response.data.weather[0].description;  
    return `The weather in ${city} is ${temp}°C with ${description}.`;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
}

module.exports = { getWeather } 