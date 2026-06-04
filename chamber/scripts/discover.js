const grid = document.querySelector("#discoverGrid");
const visitMessage = document.querySelector("#visitMessage");
const visitKey = "monroviaChamberLastVisit";
const dayInMilliseconds = 24 * 60 * 60 * 1000;

function showVisitMessage() {
  const now = Date.now();
  const storedVisit = Number(localStorage.getItem(visitKey));

  if (!storedVisit) {
    visitMessage.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const elapsedDays = Math.floor((now - storedVisit) / dayInMilliseconds);

    if (elapsedDays < 1) {
      visitMessage.textContent = "Back so soon! Awesome!";
    } else if (elapsedDays === 1) {
      visitMessage.textContent = "You last visited 1 day ago.";
    } else {
      visitMessage.textContent = `You last visited ${elapsedDays} days ago.`;
    }
  }

  localStorage.setItem(visitKey, String(now));
}

function buildCard(place) {
  return `
    <article class="discover-card">
      <h3>${place.name}</h3>
      <figure>
        <img src="${place.image}" alt="${place.name}" width="1" height="1" loading="lazy">
      </figure>
      <address>${place.address}</address>
      <p>${place.description}</p>
      <a class="learn-more" href="${place.url}" target="_blank" rel="noopener">Learn More</a>
    </article>
  `;
}

async function getDiscoverPlaces() {
  try {
    const response = await fetch("data/discover.json");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const places = await response.json();
    grid.innerHTML = places.map(buildCard).join("");
  } catch (error) {
    grid.innerHTML = `<p class="load-error">Discover places could not be loaded. ${error.message}</p>`;
  }
}

showVisitMessage();
getDiscoverPlaces();
