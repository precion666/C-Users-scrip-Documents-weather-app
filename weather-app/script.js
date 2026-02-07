async function fetchWeather() {
  const searchInput = document.getElementById('search').value.trim();
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";

  const apiKey = "675504b6cd5f3954bc4feaa2ef3c2d02";

  if (!searchInput) {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  async function getLonAndLat() {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)}&limit=1&appid=${apiKey}`;

    try {
      const response = await fetch(geocodeURL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (!data.length) {
        weatherDataSection.innerHTML = `
          <div>
            <h2>Invalid Input: "${searchInput}"</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
          </div>
        `;
        return null;
      }
      return data[0];
    } catch (error) {
      console.error("Error fetching geocode:", error);
      weatherDataSection.innerHTML = `
        <div>
          <h2>Error fetching location</h2>
          <p>Something went wrong. Please try again later.</p>
        </div>
      `;
      return null;
    }
  }

  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    try {
      const response = await fetch(weatherURL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      weatherDataSection.style.display = "flex";
      weatherDataSection.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
        <div>
          <h2>${data.name}</h2>
          <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
          <p><strong>Description:</strong> ${data.weather[0].description}</p>
        </div>
      `;
    } catch (error) {
      console.error("Error fetching weather:", error);
      weatherDataSection.innerHTML = `
        <div>
          <h2>Error fetching weather</h2>
          <p>Could not retrieve weather data. Please try again later.</p>
        </div>
      `;
    }
  }

  document.getElementById("search").value = "";

  const geocodeData = await getLonAndLat();
  if (geocodeData) {
    await getWeatherData(geocodeData.lon, geocodeData.lat);
  }
}
