export const mobileMenuManager = () => {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!mobileMenu || !mobileMenuButton) return;

  const isVisible = () => mobileMenu.classList.contains("show");
  const toggle = () => {
    const visible = isVisible();
    mobileMenu.classList.toggle("show", !visible);
    mobileMenuButton.setAttribute("aria-expanded", !visible);
  };
  const close = () => {
    mobileMenu.classList.remove("show");
    mobileMenuButton.setAttribute("aria-expanded", "false");
  };

  const handleClick = event => {
    const { target } = event;
    if (mobileMenuButton.contains(target)) {
      toggle();
    } else if (!mobileMenu.contains(target) && isVisible()) {
      close();
    }
  };

  const handleEscape = event => {
    if (event.key === "Escape" && isVisible()) {
      close();
    }
  };

  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", handleEscape);
};
