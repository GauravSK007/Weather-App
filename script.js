// Theme toggle functionality
const themeButtonMobile = document.getElementById("theme-mobile");

const html = document.documentElement;
themeButtonMobile.addEventListener("click", () => {
  html.classList.toggle("dark");
  if (html.classList.contains("dark")) {
    themeButton.textContent = "☀️"; // Change to sun icon
  } else {
    themeButton.textContent = "🌙"; // Change to moon icon
  }
});

const themeButtonDekstop = document.getElementById("theme-dekstop");
themeButtonDekstop.addEventListener("click", () => {
  html.classList.toggle("dark");
  if (html.classList.contains("dark")) {
    themeButtonDekstop.textContent = "☀️"; // Change to sun icon
  } else {
    themeButtonDekstop.textContent = "🌙"; // Change to moon icon
  }
});

let intervalId = null;

async function getweatherdata() {
  let locationResponse;
  let weatherResponse;
  let weatherdata;
  let locationData;
  let latitude;
  let longitude;

  //fetching loction through IP
  locationResponse = await fetch("https://ipinfo.io/json");
  locationData = await locationResponse.json();

  //city
  let city = locationData.city;
  let region = locationData.region;
  let timezone = locationData.timezone;

  //extract coordinates
  latitude = locationData.loc.split(",")[0];
  longitude = locationData.loc.split(",")[1];

  //fetching weather data
  weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
  );
  weatherdata = await weatherResponse.json();

  //imp data
  let weather = weatherdata.current_weather;
  let weekWeather = weatherdata.daily;

  let temperature = weather.temperature;
  let windspeed = weather.windspeed;
  let isday = weather.is_day;
  let weathercode = weather.weathercode;

  let dates = weekWeather.time;
  let maxTemp = weekWeather.temperature_2m_max;
  let minTemp = weekWeather.temperature_2m_min;
  let rain = weekWeather.precipitation_probability_max;

  //displaying data
  document.getElementById("city").innerText =
    city == region ? city : `${city}, ${region}`;
  document.getElementById("temperature").innerText = temperature + "°C";
  document.getElementById(
    "min-max"
  ).innerHTML = `<span class="font-medium">Min:</span> ${minTemp[0]}°C &nbsp;&nbsp; <span class="font-medium">Max:</span> ${maxTemp[0]}°C`;
  document.getElementById("rain").innerText =
    rain[0] > 50
      ? `There's an ${rain[0]}% chance of rain—better carry an umbrella!`
      : `There's an ${rain[0]}% chance of rain.`;

  //displaying emoji for codes
  function getWeatherEmoji(code, isDay) {
    const emojiMap = {
      0: isDay === 1 ? "☀️" : "🌙",
      1: isDay === 1 ? "🌤️" : "🌙☁️",
      2: isDay === 1 ? "⛅" : "☁️🌙",
      3: "☁️",
      45: "🌫️",
      48: "🌫️",
      51: isDay === 1 ? "🌦️" : "🌧️",
      53: isDay === 1 ? "🌦️" : "🌧️",
      55: isDay === 1 ? "🌦️" : "🌧️",
      56: "🧊🌧️",
      57: "🧊🌧️",
      61: "🌧️",
      63: "🌧️",
      65: "🌧️",
      66: "🧊🌧️",
      67: "🧊🌧️",
      71: "❄️",
      73: "❄️",
      75: "❄️",
      77: "🌨️",
      80: isDay === 1 ? "🌦️" : "🌧️",
      81: isDay === 1 ? "🌦️" : "🌧️",
      82: isDay === 1 ? "🌦️" : "🌧️",
      85: "🌨️",
      86: "🌨️",
      95: "⛈️",
      96: "⛈️🧊",
      99: "⛈️🧊",
    };

    return emojiMap[code] || "❓";
  }

  let emojiC = getWeatherEmoji(weathercode, isday);
  document.getElementById("code").innerText = emojiC;

  let tableHTML = `
  <thead class="bg-blue-500 dark:bg-gray-900 text-white">
    <tr>
      <th class="py-2 px-3 font-semibold">Date</th>
      <th class="py-2 px-3 font-semibold">Min Temp</th>
      <th class="py-2 px-3 font-semibold">Max Temp</th>
      <th class="py-2 px-3 font-semibold">Rain Chance</th>
    </tr>
  </thead>
  <tbody>
`;

  for (let i = 1; i < dates.length; i++) {
    tableHTML += `
      <tr class="hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors">
        <td class="py-2 h-[50px] w-[100px] text-gray-700 dark:text-gray-200">${dates[i]}</td>
        <td class="py-2 px-3 text-gray-700 dark:text-gray-200">${minTemp[i]}°C</td>
        <td class="py-2 px-3 text-gray-700 dark:text-gray-200">${maxTemp[i]}°C</td>
        <td class="py-2 px-3 text-gray-700 dark:text-gray-200">${rain[i]}%</td>
      </tr>
    `;
  }

  tableHTML += `</tbody>`;

  document.querySelector("#forecastTable").innerHTML = tableHTML;

  // Displaying local time
  let localTime = document.getElementById("localTime");
  function showClock() {
    const time = new Date().toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour12: true,
    });

    localTime.innerText = time;
  }
  intervalId = setInterval(showClock, 1000);
  showClock();
}

//calling main async function
getweatherdata();
const factsAndQuotes = [
  "Some people feel the rain, others just get wet. – Bob Marley. It’s not about the weather, it’s about your mindset.",
  "Wherever you go, no matter what the weather, always bring your own sunshine. – Anthony J. D'Angelo. Positivity changes everything.",
  "Sunshine is delicious, rain is refreshing, wind braces us up, and snow is exhilarating. There is really no such thing as bad weather. – John Ruskin",
  "After rain comes sunshine. Every storm runs out of rain eventually. – Old Proverb",
  "Raindrops aren’t actually tear-shaped—they form more like burger buns when falling due to air resistance.",
  "The highest temperature ever recorded on Earth was 56.7°C in Death Valley, USA, back in 1913—a record that still stands over a century later.",
  "Lightning is about five times hotter than the surface of the sun, reaching temperatures of up to 30,000°C in just a split second.",
  "It rains more frequently in London than Mumbai, but Mumbai gets more rainfall overall—London just spreads it out over more days.",
  "A single lightning bolt can contain up to one billion volts of electricity, enough to toast 100,000 slices of bread at once!",
  "Snowflakes are not all unique! Scientists have actually found identical snowflakes under controlled lab conditions, although it's super rare.",
];

let skySays = document.getElementById("skySays");
skySays.innerText =
  factsAndQuotes[Math.floor(Math.random() * factsAndQuotes.length)];

//Search functionality
let cityInput = document.getElementById("cityInput");
let searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", async (e) => {
  e.preventDefault();
  let city = cityInput.value.trim();
  if (city) {
    try {

      const loader = document.getElementById('loader');
      loader.classList.remove('hidden');
      loader.classList.add('flex');

      let cityResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      let cityData = await cityResponse.json();
      //fetching weather data

      let citylatitude = cityData.results[0].latitude;
      let citylongitude = cityData.results[0].longitude;
      let citytimezone = cityData.results[0].timezone;
      let cityname = cityData.results[0].name;
      let region = cityData.results[0].admin1;

      weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${citylatitude}&longitude=${citylongitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
      );
      weatherdata = await weatherResponse.json();

      //imp data
      let weather = weatherdata.current_weather;
      let weekWeather = weatherdata.daily;

      let temperature = weather.temperature;
      let windspeed = weather.windspeed;
      let isday = weather.is_day;
      let weathercode = weather.weathercode;

      let dates = weekWeather.time;
      let maxTemp = weekWeather.temperature_2m_max;
      let minTemp = weekWeather.temperature_2m_min;
      let rain = weekWeather.precipitation_probability_max;

      //displaying data
      document.getElementById("city").innerText =
        city == region ? cityname : `${cityname}, ${region}`;
      document.getElementById("temperature").innerText = temperature + "°C";
      document.getElementById(
        "min-max"
      ).innerHTML = `<span class="font-medium">Min:</span> ${minTemp[0]}°C &nbsp;&nbsp; <span class="font-medium">Max:</span> ${maxTemp[0]}°C`;
      document.getElementById("rain").innerText =
        rain[0] > 50
          ? `There's an ${rain[0]}% chance of rain—better carry an umbrella!`
          : `There's an ${rain[0]}% chance of rain.`;

      //displaying emoji for codes
      function getWeatherEmoji(code, isDay) {
        const emojiMap = {
          0: isDay === 1 ? "☀️" : "🌙",
          1: isDay === 1 ? "🌤️" : "🌙☁️",
          2: isDay === 1 ? "⛅" : "☁️🌙",
          3: "☁️",
          45: "🌫️",
          48: "🌫️",
          51: isDay === 1 ? "🌦️" : "🌧️",
          53: isDay === 1 ? "🌦️" : "🌧️",
          55: isDay === 1 ? "🌦️" : "🌧️",
          56: "🧊🌧️",
          57: "🧊🌧️",
          61: "🌧️",
          63: "🌧️",
          65: "🌧️",
          66: "🧊🌧️",
          67: "🧊🌧️",
          71: "❄️",
          73: "❄️",
          75: "❄️",
          77: "🌨️",
          80: isDay === 1 ? "🌦️" : "🌧️",
          81: isDay === 1 ? "🌦️" : "🌧️",
          82: isDay === 1 ? "🌦️" : "🌧️",
          85: "🌨️",
          86: "🌨️",
          95: "⛈️",
          96: "⛈️🧊",
          99: "⛈️🧊",
        };

        return emojiMap[code] || "❓";
      }

      let emojiC = getWeatherEmoji(weathercode, isday);
      document.getElementById("code").innerText = emojiC;

      let tableHTML = `
  <thead class="bg-blue-500 dark:bg-gray-900 text-white">
    <tr>
      <th class="py-2 px-3 font-semibold">Date</th>
      <th class="py-2 px-3 font-semibold">Min Temp</th>
      <th class="py-2 px-3 font-semibold">Max Temp</th>
      <th class="py-2 px-3 font-semibold">Rain Chance</th>
    </tr>
  </thead>
  <tbody>
`;

      for (let i = 1; i < dates.length; i++) {
        tableHTML += `
      <tr class="hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors">
        <td class="py-2 h-[50px] w-[100px] text-gray-700 dark:text-gray-200">${dates[i]}</td>
        <td class="py-2 px-3 text-gray-700 dark:text-gray-200">${minTemp[i]}°C</td>
        <td class="py-2 px-3 text-gray-700 dark:text-gray-200">${maxTemp[i]}°C</td>
        <td class="py-2 px-3 text-gray-700 dark:text-gray-200">${rain[i]}%</td>
      </tr>
    `;
      }

      tableHTML += `</tbody>`;

      document.querySelector("#forecastTable").innerHTML = tableHTML;

      clearInterval(intervalId);

      // Displaying local time
      let localTime = document.getElementById("localTime");
      function showClock() {
        const time = new Date().toLocaleTimeString("en-US", {
          timeZone: citytimezone,
          hour12: true,
        });

        localTime.innerText = time;
      }
      intervalId = setInterval(showClock, 1000);
      showClock();
    } catch (error) {
      alert(error.message);
    }
    finally {
      const loader = document.getElementById('loader');
      loader.classList.add('hidden');
    }
  } else {
    alert("Please enter a valid city name.");
  }
});
