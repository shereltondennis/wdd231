const menuButton = document.querySelector("#menuButton");
const nav = document.querySelector("#primary-navigation");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.innerHTML = isOpen
      ? '<span aria-hidden="true">&times;</span>'
      : '<span aria-hidden="true">&#9776;</span>';
  });
}
