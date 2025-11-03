export const mobileMenuManager = () => {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  const isMobileMenuVisible = () => mobileMenu?.classList.contains("show");

  const openMobileMenu = () => {
    if (!mobileMenu || !mobileMenuButton) return;
    mobileMenu.classList.add("show");
    mobileMenuButton.setAttribute("aria-expanded", "true");
  };

  const closeMobileMenu = () => {
    if (!mobileMenu || !mobileMenuButton) return;
    mobileMenu.classList.remove("show");
    mobileMenuButton.setAttribute("aria-expanded", "false");
  };

  const handleMobileMenu = (event) => {
    if (!mobileMenu || !mobileMenuButton) return;
    const target = event.target;
    const clickedInsideMenu = mobileMenu.contains(target);
    const clickedButton = mobileMenuButton.contains(target);

    // Toggle on button click
    if (clickedButton) {
      isMobileMenuVisible() ? closeMobileMenu() : openMobileMenu();
      return;
    }

    if (!clickedInsideMenu && isMobileMenuVisible()) {
      closeMobileMenu();
    }
  };

  const handleEscapeKey = (event) => {
    if (event.key === "Escape" && isMobileMenuVisible()) {
      closeMobileMenu();
    }
  };

  document.addEventListener("keydown", handleEscapeKey);
  document.addEventListener("click", handleMobileMenu);
};
