const newsletterFrameName = "brevo-newsletter-submit";

function getNewsletterFrame() {
  let frame = document.getElementById(newsletterFrameName);

  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = newsletterFrameName;
    frame.name = newsletterFrameName;
    frame.title = "Confirmação do cadastro de novidades";
    frame.hidden = true;
    document.body.appendChild(frame);
  }

  return frame;
}

// Cria o destino antes de qualquer clique para que o navegador mantenha a
// resposta do Brevo dentro do site.
getNewsletterFrame();

document.querySelectorAll(".newsletter-form").forEach(function (form) {
  const status = form.querySelector(".newsletter-status");
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", function () {
    const name = form.querySelector("[data-newsletter-name]");

    if (name) name.value = name.value.trim();

    // Mantém o POST oficial do Brevo, mas recebe a resposta em um iframe oculto.
    // Assim o visitante não é levado à resposta técnica em JSON.
    const frame = getNewsletterFrame();
    form.target = frame.name;
    status.textContent = "Enviando seu cadastro…";
    button.disabled = true;

    window.setTimeout(function () {
      form.reset();
      status.textContent = "Cadastro realizado. Confira seu e-mail para confirmar a assinatura.";
      button.disabled = false;
    }, 700);
  });

  form.addEventListener("input", function () {
    status.textContent = "";
  });
});
