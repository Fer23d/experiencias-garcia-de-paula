const newsletterFrameName = "brevo-newsletter-submit";

function getNewsletterFrame() {
  let frame = document.getElementById(newsletterFrameName);

  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = newsletterFrameName;
    frame.name = newsletterFrameName;
    frame.title = "Envio do cadastro de novidades";
    frame.hidden = true;
    document.body.appendChild(frame);
  }

  return frame;
}

document.querySelectorAll(".newsletter-form").forEach(function (form) {
  const status = form.querySelector(".newsletter-status");
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", function (event) {
    const name = form.elements.namedItem("FIRSTNAME");

    if (name) name.value = name.value.trim();
    if (!form.reportValidity()) {
      event.preventDefault();
      return;
    }

    getNewsletterFrame();
    form.target = newsletterFrameName;
    status.textContent = "Enviando seu cadastro ao Brevo…";

    window.setTimeout(function () {
      form.reset();
      status.textContent = "Cadastro enviado. Se necessário, confira seu e-mail para confirmar a assinatura.";
      button.disabled = false;
    }, 600);

    button.disabled = true;
  });

  form.addEventListener("input", function () {
    status.textContent = "";
  });
});
