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
  const frame = getNewsletterFrame();

  // Envia o próprio formulário que contém os campos oficiais fornecidos pelo Brevo.
  // Assim não há reconstrução nem remoção de elementos durante a requisição.
  form.target = frame.name;
  form.submit();
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
