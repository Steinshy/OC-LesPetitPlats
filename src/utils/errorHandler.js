const ERROR_BANNER_ID = "error-banner";

const getBanner = () => document.querySelector(`#${ERROR_BANNER_ID}`);

export const showError = message => {
  const existing = getBanner();
  if (existing) {
    existing.textContent = message;
    existing.hidden = false;
    return;
  }
  const headerNav = document.querySelector("#header .header-nav");
  if (!headerNav) return;
  headerNav.insertAdjacentHTML(
    "afterend",
    `<div id="${ERROR_BANNER_ID}" role="alert" class="error-banner">${message}</div>`,
  );
};

export const hideError = () => {
  getBanner()?.setAttribute("hidden", "");
};
