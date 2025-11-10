const getScrollToTopButton = () => document.getElementById("scroll-to-top");

const handleScrollVisibility = () => {
  const button = getScrollToTopButton();
  if (!button) return;
  const shouldShow = window.scrollY > 300;
  button.classList.toggle("show", shouldShow);
  button.setAttribute("aria-hidden", !shouldShow);
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  getScrollToTopButton()?.blur();
};

export const initScrollToTop = () => {
  const button = getScrollToTopButton();
  if (!button) return;

  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScrollVisibility();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  button.addEventListener("click", scrollToTop);

  handleScrollVisibility();
};
