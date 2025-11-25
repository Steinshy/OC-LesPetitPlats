import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

let activeToasts = [];

const errorMessages = {
  default: "Une erreur est survenue lors du chargement de l'application.",
  network: "Une erreur de réseau est survenue lors du chargement de l'application.",
  timeout: "Le chargement de l'application a pris trop de temps.",
  invalidData: "Les données de l'application sont invalides.",
  unknown: "Une erreur inconnue est survenue lors du chargement de l'application.",
};

export const showError = message => {
  const toast = Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "#f44",
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

export const setupAppError = (error, type = "default") => {
  console.error("Error loading recipes:", error);
  const errorMessage = error?.message || errorMessages[type];
  showError(errorMessage);
};
