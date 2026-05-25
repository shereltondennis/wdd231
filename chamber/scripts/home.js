const MONROVIA_COORDS = {
  lat: 6.30054,
  lon: -10.7969
};

const currentTempElement = document.querySelector("#currentTemp");
const currentDescElement = document.querySelector("#currentDesc");
const forecastList = document.querySelector("#forecastList");
const spotlightContainer = document.querySelector("#spotlightContainer");

const membershipLabels = {
  2: "Silver",
  3: "Gold"
};

const weatherCodeLabels = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};

const formatTemperature = (temp) => `${Math.round(temp)} C`;

const getWeekdayLabel = (dateText) => {
  const date = new Date(`${dateText}T00:00:00`);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const renderWeatherError = (message) => {
  if (currentTempElement) {
    currentTempElement.textContent = "Unavailable";
  }

  if (currentDescElement) {
    currentDescElement.textContent = message;
  }

  if (forecastList) {
    forecastList.innerHTML = `<li>${message}</li>`;
  }
};

const loadWeather = async () => {
  if (!currentTempElement || !currentDescElement || !forecastList) {
    return;
  }

  try {
    const query = `latitude=${MONROVIA_COORDS.lat}&longitude=${MONROVIA_COORDS.lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max&timezone=Africa%2FMonrovia&forecast_days=4`;
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`);

    if (!response.ok) {
      throw new Error("Weather request failed.");
    }

    const weatherData = await response.json();
    const currentTemp = weatherData?.current?.temperature_2m;
    const currentCode = weatherData?.current?.weather_code;
    const forecastDates = weatherData?.daily?.time ?? [];
    const forecastCodes = weatherData?.daily?.weather_code ?? [];
    const forecastTemps = weatherData?.daily?.temperature_2m_max ?? [];

    if (typeof currentTemp !== "number" || typeof currentCode !== "number") {
      throw new Error("Incomplete current weather data.");
    }

    currentTempElement.textContent = formatTemperature(currentTemp);
    currentDescElement.textContent = weatherCodeLabels[currentCode] ?? "Unknown conditions";

    forecastList.innerHTML = "";

    const threeDay = forecastDates.slice(1, 4)
      .map((date, index) => ({
        day: date,
        code: forecastCodes[index + 1],
        temp: forecastTemps[index + 1]
      }))
      .filter((entry) => typeof entry.code === "number" && typeof entry.temp === "number");

    if (!threeDay.length) {
      forecastList.innerHTML = "<li>Forecast data is currently unavailable.</li>";
      return;
    }

    threeDay.forEach((entry) => {
      const item = document.createElement("li");
      const condition = weatherCodeLabels[entry.code] ?? "Forecast unavailable";
      item.innerHTML = `<span class="forecast-day">${getWeekdayLabel(entry.day)}</span><span>${condition}</span><span>${formatTemperature(entry.temp)}</span>`;
      forecastList.appendChild(item);
    });
  } catch (error) {
    renderWeatherError("Unable to load weather data right now.");
    console.error(error);
  }
};

const shuffleArray = (items) => {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[randomIndex]] = [clone[randomIndex], clone[i]];
  }
  return clone;
};

const createSpotlightCard = (member) => {
  const membership = membershipLabels[member.membershipLevel] || "Member";
  const membershipClass = membership.toLowerCase();

  const card = document.createElement("article");
  card.className = "spotlight-card";
  card.innerHTML = `
    <img src="images/${member.image}" alt="${member.name} logo" width="88" height="88" loading="lazy">
    <h3>${member.name}</h3>
    <p><strong>Phone:</strong> ${member.phone}</p>
    <p><strong>Address:</strong> ${member.address}</p>
    <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>
    <span class="spotlight-level ${membershipClass}">${membership} Member</span>
  `;

  return card;
};

const loadSpotlights = async () => {
  if (!spotlightContainer) {
    return;
  }

  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Unable to load member data (${response.status}).`);
    }

    const members = await response.json();
    const eligibleMembers = members.filter((member) => member.membershipLevel === 2 || member.membershipLevel === 3);

    if (!eligibleMembers.length) {
      spotlightContainer.innerHTML = "<p>No spotlight members are currently available.</p>";
      return;
    }

    const shuffled = shuffleArray(eligibleMembers);
    const selectedCount = Math.min(shuffled.length, Math.random() < 0.5 ? 2 : 3);
    const selectedMembers = shuffled.slice(0, selectedCount);

    spotlightContainer.innerHTML = "";
    selectedMembers.forEach((member) => spotlightContainer.append(createSpotlightCard(member)));
  } catch (error) {
    spotlightContainer.innerHTML = "<p>Unable to load member spotlights right now.</p>";
    console.error(error);
  }
};

loadWeather();
loadSpotlights();
