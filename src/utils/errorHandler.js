let activeToasts = [];
let toastifyLoaded = false;
let Toastify = null;

const errorMessages = {
  default: "Une erreur est survenue lors du chargement de l'application.",
  network: "Une erreur de réseau est survenue lors du chargement de l'application.",
  timeout: "Le chargement de l'application a pris trop de temps.",
  invalidData: "Les données de l'application sont invalides.",
  unknown: "Une erreur inconnue est survenue lors du chargement de l'application.",
};

/**
 * Lazy loads Toastify library and its CSS
 * @returns {Promise<Object>} Toastify default export
 */
const loadToastify = async () => {
  if (toastifyLoaded && Toastify) {
    return Toastify;
  }

  // Load Toastify and CSS in parallel
  const [toastifyModule] = await Promise.all([
    import("toastify-js"),
    import("toastify-js/src/toastify.css"),
  ]);

  Toastify = toastifyModule.default;
  toastifyLoaded = true;
  return Toastify;
};

export const showError = async message => {
  const ToastifyLib = await loadToastify();

  const toast = ToastifyLib({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    style: {
      background: "#f44",
    },
    stopOnFocus: true,
  });

  activeToasts.push(toast);
  toast.showToast();
};

export const hideError = () => {
  activeToasts.forEach(toast => {
    toast.hideToast();
  });
  activeToasts = [];
};

export const setupAppError = async (error, type = "default") => {
  console.error("Error loading recipes:", error);
  const errorMessage = error?.message || errorMessages[type];
  await showError(errorMessage);
};
