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

function submitToBrevo(form) {
  const submission = document.createElement("form");
  const fieldNames = ["EMAIL", "email_address_check", "locale", "html_type"];

  submission.method = "post";
  submission.action = form.action;
  submission.target = newsletterFrameName;
  submission.hidden = true;

  fieldNames.forEach(function (fieldName) {
    const source = form.elements.namedItem(fieldName);
    const field = document.createElement("input");

    field.type = "hidden";
    field.name = fieldName;
    field.value = source ? source.value : "";
    submission.appendChild(field);
  });

  document.body.appendChild(submission);
  submission.submit();
  window.setTimeout(function () {
    submission.remove();
  }, 2000);
}

document.querySelectorAll(".newsletter-form").forEach(function (form) {
  const status = form.querySelector(".newsletter-status");
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", function (event) {
    const name = form.querySelector("[data-newsletter-name]");

    if (name) name.value = name.value.trim();
    event.preventDefault();
    if (!form.reportValidity()) {
      return;
    }

    getNewsletterFrame();
    submitToBrevo(form);
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
