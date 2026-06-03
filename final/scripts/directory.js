import { setupNavigation, updateFooter } from "./shared.js";

const grid = document.querySelector("#restaurant-grid");
const filter = document.querySelector("#cuisine-filter");
const count = document.querySelector("#listing-count");
const saveButton = document.querySelector("#save-preference");
const note = document.querySelector("#preference-note");
const dialog = document.querySelector("#details-dialog");
const dialogContent = document.querySelector("#dialog-content");
const closeButton = document.querySelector("#dialog-close");
const preferenceKey = "monrovia-food-cuisine";
let restaurants = [];

setupNavigation();
updateFooter();

async function getRestaurants() {
  try {
    const response = await fetch("data/restaurants.json");
    if (!response.ok) {
      throw new Error(`Data request failed: ${response.status}`);
    }
    restaurants = await response.json();
    buildCuisineFilter(restaurants);
    applySavedPreference();
    renderRestaurants();
  } catch (error) {
    grid.innerHTML = `<p class="status">The dining listings could not be loaded. ${error.message}</p>`;
  }
}

function buildCuisineFilter(items) {
  const cuisines = [...new Set(items.map((item) => item.cuisine))].sort();
  cuisines.forEach((cuisine) => {
    const option = document.createElement("option");
    option.value = cuisine;
    option.textContent = cuisine;
    filter.appendChild(option);
  });
}

function applySavedPreference() {
  const saved = localStorage.getItem(preferenceKey);
  if (saved && [...filter.options].some((option) => option.value === saved)) {
    filter.value = saved;
    note.textContent = `Saved preference: ${saved}`;
  }
}

function renderRestaurants() {
  const selected = filter.value;
  const visible = selected === "all"
    ? restaurants
    : restaurants.filter((restaurant) => restaurant.cuisine === selected);

  count.textContent = `${visible.length} listing${visible.length === 1 ? "" : "s"} shown`;
  grid.innerHTML = visible.map((restaurant, index) => cardTemplate(restaurant, index)).join("");

  grid.querySelectorAll("button[data-index]").forEach((button) => {
    button.addEventListener("click", () => openDetails(visible[Number(button.dataset.index)]));
  });
}

function cardTemplate(restaurant, index) {
  return `
    <article class="restaurant-card">
      <img src="${restaurant.image}" alt="${restaurant.specialty}" width="420" height="236" loading="lazy">
      <h3>${restaurant.name}</h3>
      <ul class="meta-list">
        <li><strong>Cuisine:</strong> ${restaurant.cuisine}</li>
        <li><strong>Neighborhood:</strong> ${restaurant.neighborhood}</li>
        <li><strong>Price:</strong> ${restaurant.price}</li>
        <li><strong>Rating:</strong> ${restaurant.rating.toFixed(1)}</li>
      </ul>
      <button class="button secondary" type="button" data-index="${index}">View Details</button>
    </article>
  `;
}

function openDetails(restaurant) {
  dialogContent.innerHTML = `
    <h2 id="dialog-title">${restaurant.name}</h2>
    <p>${restaurant.description}</p>
    <ul class="meta-list">
      <li><strong>Specialty:</strong> ${restaurant.specialty}</li>
      <li><strong>Best time:</strong> ${restaurant.bestTime}</li>
      <li><strong>Service:</strong> ${restaurant.service}</li>
      <li><strong>Neighborhood:</strong> ${restaurant.neighborhood}</li>
    </ul>
  `;
  dialog.showModal();
  closeButton.focus();
}

filter.addEventListener("change", renderRestaurants);

saveButton.addEventListener("click", () => {
  localStorage.setItem(preferenceKey, filter.value);
  note.textContent = filter.value === "all"
    ? "Saved preference: all cuisines"
    : `Saved preference: ${filter.value}`;
});

closeButton.addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

getRestaurants();
