document.querySelectorAll(".newsletter-form").forEach(function (form) {
  form.addEventListener("submit", function () {
    const name = form.querySelector("[data-newsletter-name]");

    if (name) name.value = name.value.trim();
  });
});
