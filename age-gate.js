(function () {
  "use strict";

  const storageKey = "gdp-age-confirmed";
  const gate = document.getElementById("age-gate");
  const prompt = document.getElementById("age-gate-prompt");
  const denied = document.getElementById("age-gate-denied");

  if (!gate || !prompt || !denied) return;

  function hideGate() {
    gate.classList.add("is-leaving");

    window.setTimeout(function () {
      gate.hidden = true;
      document.body.classList.remove("age-gate-open");
      gate.classList.remove("is-leaving");
    }, 220);
  }

  function showGate() {
    gate.hidden = false;
    document.body.classList.add("age-gate-open");
    prompt.hidden = false;
    denied.hidden = true;
    gate.querySelector('[data-age-response="deny"]').focus();
  }

  function storeConfirmation() {
    try {
      window.localStorage.setItem(storageKey, "true");
    } catch (error) {
      // The gate remains functional when browser storage is unavailable.
    }
  }

  function hasConfirmation() {
    try {
      return window.localStorage.getItem(storageKey) === "true";
    } catch (error) {
      return false;
    }
  }

  function isTermsAccessAfterDenial() {
    const parameters = new URLSearchParams(window.location.search);

    return window.location.pathname.endsWith("/termos.html") && parameters.get("age-gate") === "declined";
  }

  gate.addEventListener("click", function (event) {
    const button = event.target.closest("[data-age-response]");
    if (!button) return;

    if (button.dataset.ageResponse === "accept") {
      storeConfirmation();
      hideGate();
      return;
    }

    if (button.dataset.ageResponse === "deny") {
      window.location.href = "termos.html?age-gate=declined";
      return;
    }

    showGate();
  });

  if (hasConfirmation() || isTermsAccessAfterDenial()) {
    gate.hidden = true;
  } else {
    showGate();
  }
}());
