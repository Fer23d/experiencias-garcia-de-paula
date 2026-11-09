// Newsletter Brevo (SibForms) — envio nativo para um iframe oculto.
//
// O <form> já declara target="brevo-newsletter-submit" e o <iframe> com esse
// nome existe no HTML desde o carregamento. Assim o POST oficial nunca abre a
// resposta JSON ({"success":true}) na aba, mesmo que este script falhe.
//
// O conteúdo do iframe é cross-origin (sibforms.com) e não pode ser lido.
// Por isso o sucesso é inferido pelo evento "load" do iframe após o envio:
// ele só dispara quando o Brevo devolve uma resposta. Sem resposta dentro do
// prazo, mostramos uma mensagem de erro em vez de um falso sucesso.

const NEWSLETTER_FRAME_NAME = "brevo-newsletter-submit";
const NEWSLETTER_TIMEOUT_MS = 15000;

const MESSAGES = {
  sending: "Enviando seu cadastro…",
  success: "Quase lá! Enviamos um e-mail de confirmação. Clique no link dele para concluir a assinatura (confira também o spam).",
  timeout: "Não foi possível confirmar o envio. Verifique sua conexão e tente novamente."
};

function ensureNewsletterFrame(form) {
  let frame = document.querySelector('iframe[name="' + NEWSLETTER_FRAME_NAME + '"]');

  // Rede de segurança para páginas que ainda não tenham o iframe no HTML.
  if (!frame) {
    frame = document.createElement("iframe");
    frame.className = "newsletter-frame";
    frame.name = NEWSLETTER_FRAME_NAME;
    frame.id = NEWSLETTER_FRAME_NAME;
    frame.title = "Envio do cadastro de novidades";
    frame.tabIndex = -1;
    frame.setAttribute("aria-hidden", "true");
    frame.hidden = true;
    form.insertAdjacentElement("afterend", frame);
  }

  form.target = NEWSLETTER_FRAME_NAME;
  return frame;
}

document.querySelectorAll(".newsletter-form").forEach(function (form) {
  const status = form.querySelector(".newsletter-status");
  const button = form.querySelector('button[type="submit"]');
  const frame = ensureNewsletterFrame(form);
  let pending = false;
  let timeoutId = null;

  function finish(message, isError) {
    pending = false;
    window.clearTimeout(timeoutId);
    if (button) button.disabled = false;
    form.classList.toggle("is-error", Boolean(isError));
    form.classList.toggle("is-success", !isError);
    if (status) status.textContent = message;
  }

  // Só conta como sucesso o "load" que acontece depois de um envio.
  // O load inicial do iframe vazio (about:blank) é ignorado.
  frame.addEventListener("load", function () {
    if (!pending) return;
    form.reset();
    finish(MESSAGES.success, false);
  });

  form.addEventListener("submit", function (event) {
    if (pending) {
      event.preventDefault();
      return;
    }

    const name = form.querySelector("[data-newsletter-name]");
    if (name) name.value = name.value.trim();

    // Garante o destino mesmo se algo tiver alterado o atributo.
    form.target = NEWSLETTER_FRAME_NAME;

    pending = true;
    form.classList.remove("is-error", "is-success");
    if (status) status.textContent = MESSAGES.sending;

    // Desabilitar o botão no mesmo tick cancelaria o envio em alguns
    // navegadores; adiamos para depois que o POST já começou.
    window.setTimeout(function () {
      if (pending && button) button.disabled = true;
    }, 0);

    timeoutId = window.setTimeout(function () {
      if (pending) finish(MESSAGES.timeout, true);
    }, NEWSLETTER_TIMEOUT_MS);
  });

  form.addEventListener("input", function () {
    if (pending) return;
    form.classList.remove("is-error", "is-success");
    if (status) status.textContent = "";
  });
});
