import { render } from "solid-js/web";

(async () => {
    const el = document.getElementById("pomment-widget");
    if (el) {
        const { Comment } = await import("../components/comment/Comment");
        render(() => Comment(), el);
    }
})();
