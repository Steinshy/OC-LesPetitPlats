const createErrorBanner = (message) => {
  return `
    <div id="error-banner" role="alert" class="error-banner">
      ${message}
    </div>
  `;
};

export const showError = (message) => {
  const existing = document.querySelector("#error-banner");
  if (existing) {
    existing.textContent = message;
    existing.hidden = false;
    return;
  }
  const root = document.querySelector("#root");
  if (!root) return;
  root.insertAdjacentHTML("afterbegin", createErrorBanner(message));
};

export const hideError = () => {
  const banner = document.querySelector("#error-banner");
  if (banner) banner.hidden = true;
};

export const initErrorTestButton = () => {
  const button = document.getElementById("error-test-button");
  if (button) {
    button.addEventListener("click", () => {
      showError("Message d'erreur de test");
    });
  }
};
