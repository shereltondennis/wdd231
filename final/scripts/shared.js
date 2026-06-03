export function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-navigation");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.innerHTML = isOpen
      ? '<span aria-hidden="true">&times;</span>'
      : '<span aria-hidden="true">&#9776;</span>';
  });
}

export function updateFooter() {
  const year = document.querySelector("#current-year");
  const modified = document.querySelector("#last-modified");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (modified) {
    modified.textContent = `Last Modified: ${document.lastModified}`;
  }
}
