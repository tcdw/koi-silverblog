import { render } from "solid-js/web";

(async () => {
  if (document.body.dataset.current === "archive") {
    const { default: Archive } = await import("../components/Archive");
    render(() => Archive(), document.querySelector(".prose")!);
  }
})();
