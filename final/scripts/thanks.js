import { setupNavigation, updateFooter } from "./shared.js";

setupNavigation();
updateFooter();

const output = document.querySelector("#submission-details");
const params = new URLSearchParams(window.location.search);
const labels = {
  name: "Full name",
  email: "Email",
  "visit-date": "Visit date",
  "group-size": "Group size",
  neighborhood: "Neighborhood",
  interest: "Dining interests",
  notes: "Notes"
};

const list = document.createElement("dl");

Object.entries(labels).forEach(([key, label]) => {
  const values = params.getAll(key).filter(Boolean);
  const value = values.length ? values.join(", ") : "Not provided";

  const term = document.createElement("dt");
  term.textContent = label;

  const description = document.createElement("dd");
  description.textContent = value;

  list.append(term, description);
});

output.appendChild(list);
