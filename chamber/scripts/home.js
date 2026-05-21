const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
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

const pickForecastDays = (forecastItems) => {
  const today = new Date().toISOString().split("T")[0];
  const byDay = new Map();

  forecastItems.forEach((item) => {
    const [datePart, timePart] = item.dt_txt.split(" ");
    if (datePart === today) {
      return;
    }

    const hour = Number(timePart.slice(0, 2));
    const candidate = {
      day: datePart,
      hour,
      temp: item.main.temp
    };

    if (!byDay.has(datePart)) {
      byDay.set(datePart, candidate);
      return;
    }

    const existing = byDay.get(datePart);
    const existingDelta = Math.abs(existing.hour - 12);
    const candidateDelta = Math.abs(hour - 12);

    if (candidateDelta < existingDelta) {
      byDay.set(datePart, candidate);
    }
  });

  return Array.from(byDay.values()).slice(0, 3);
};

const loadWeather = async () => {
  if (!currentTempElement || !currentDescElement || !forecastList) {
    return;
  }

  if (WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    renderWeatherError("Add your OpenWeatherMap API key in scripts/home.js.");
    return;
  }

  try {
    const query = `lat=${MONROVIA_COORDS.lat}&lon=${MONROVIA_COORDS.lon}&units=metric&appid=${WEATHER_API_KEY}`;
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?${query}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}`)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("Weather request failed.");
    }

    const currentWeather = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    currentTempElement.textContent = formatTemperature(currentWeather.main.temp);
    currentDescElement.textContent = currentWeather.weather[0].description;

    const threeDay = pickForecastDays(forecastData.list);

    forecastList.innerHTML = "";

    if (!threeDay.length) {
      forecastList.innerHTML = "<li>Forecast data is currently unavailable.</li>";
      return;
    }

    threeDay.forEach((entry) => {
      const item = document.createElement("li");
      item.innerHTML = `<span class="forecast-day">${getWeekdayLabel(entry.day)}</span><span>${formatTemperature(entry.temp)}</span>`;
      forecastList.append(item);
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
