import { searchElements } from "@components/search/elements.js";
import { searchSkeleton } from "@components/skeletons/manager.js";
import { debounce } from "@utils/config.js";
import { eventBus } from "@utils/eventBus.js";
export const setupSearch = () => {
  const { search, container, input, clear, submit } = searchElements();
  if (!search || !input) return () => {};

  const handleSearch = () => {
    const query = input.value.trim();
    const hasText = query.length > 0;

    eventBus.emit("filters:searchChanged", { query });

    clear?.classList.toggle("hidden", !hasText);
    submit?.classList.toggle("hidden", hasText);
    container?.classList.toggle("has-clear-btn", hasText);
  };

  const onInput = debounce(handleSearch, 120);
  input.addEventListener("input", onInput);

  const onClearClick = event => {
    event.preventDefault();
    event.stopPropagation();

    input.value = "";
    input.focus();
    handleSearch();
  };

  const onSubmitClick = event => {
    event.preventDefault();
    event.stopPropagation();

    input.focus();
    handleSearch();
  };

  if (clear) {
    clear.addEventListener("click", onClearClick);
  }

  if (submit) {
    submit.addEventListener("click", onSubmitClick);
  }

  searchSkeleton().hide();

  return () => {
    input.removeEventListener("input", onInput);
    clear?.removeEventListener("click", onClearClick);
    submit?.removeEventListener("click", onSubmitClick);
  };
};
