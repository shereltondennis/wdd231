const params = new URLSearchParams(window.location.search);

["firstName", "lastName", "email", "phone", "organization", "timestamp"].forEach((key) => {
  const element = document.querySelector(`#summary-${key}`);
  const value = params.get(key);

  if (element) {
    element.textContent = value || "Not provided";
  }
});
