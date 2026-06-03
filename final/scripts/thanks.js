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

const rows = Object.entries(labels).map(([key, label]) => {
  const values = params.getAll(key).filter(Boolean);
  const value = values.length ? values.join(", ") : "Not provided";
  return `<dt>${label}</dt><dd>${value}</dd>`;
});

output.innerHTML = `<dl>${rows.join("")}</dl>`;
