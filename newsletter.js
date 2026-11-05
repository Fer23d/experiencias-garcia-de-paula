document.querySelectorAll(".newsletter-form").forEach(function (form) {
  const status = form.querySelector(".newsletter-status");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = form.elements.namedItem("name");
    name.value = name.value.trim();
    if (!form.reportValidity()) return;

    // Placeholder until a mailing service is configured; no contact data is stored or sent.
    status.textContent = "O cadastro de novidades estará disponível em breve. Acompanhe nosso Instagram para ficar por dentro.";
  });

  form.addEventListener("input", function () {
    status.textContent = "";
  });
});
