const timestampField = document.querySelector("#timestamp");
const modalLinks = document.querySelectorAll("[data-modal]");
const closeButtons = document.querySelectorAll("[data-close]");

if (timestampField) {
  timestampField.value = new Date().toISOString();
}

modalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const modal = document.querySelector(`#${link.dataset.modal}`);

    if (modal && typeof modal.showModal === "function") {
      event.preventDefault();
      modal.showModal();
    }
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.closest("dialog").close();
  });
});
