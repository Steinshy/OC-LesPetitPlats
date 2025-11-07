// Scroll to top button functionality

const SCROLL_THRESHOLD = 300;

// Get scroll to top button element
const getScrollToTopButton = () => document.getElementById('scroll-to-top');

// Show or hide scroll button based on scroll position
const handleScrollVisibility = () => {
  const button = getScrollToTopButton();
  if (!button) return;
  
  const shouldShow = window.scrollY > SCROLL_THRESHOLD;
  button.classList.toggle('show', shouldShow);
  button.setAttribute('aria-hidden', !shouldShow);
};

// Scroll page to top smoothly
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  getScrollToTopButton()?.blur();
};

// Initialize scroll to top button
export const initScrollToTop = () => {
  const button = getScrollToTopButton();
  if (!button) return;

  // Add scroll event listener with throttling
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

  window.addEventListener('scroll', handleScroll, { passive: true });
  button.addEventListener('click', scrollToTop);
  
  // Initial check
  handleScrollVisibility();
};
