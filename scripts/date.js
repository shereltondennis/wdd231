const yearElement = document.querySelector("#currentYear");
const modifiedElement = document.querySelector("#lastModified");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (modifiedElement) {
  modifiedElement.textContent = `Last Modified: ${document.lastModified}`;
}
