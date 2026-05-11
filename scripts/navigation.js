const menuButton = document.querySelector("#menuButton");
const nav = document.querySelector("#primary-navigation");

if (menuButton && nav) {
  const closeMenu = () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = '<span aria-hidden="true">&#9776;</span>';
  };

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.innerHTML = isOpen
      ? '<span aria-hidden="true">&times;</span>'
      : '<span aria-hidden="true">&#9776;</span>';
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 700) {
      closeMenu();
    }
  });
}
