import { render } from "solid-js/web";

(async () => {
    const el = document.getElementById("pomment-widget");
    if (el) {
        const { Comment } = await import("../components/comment/Comment");

        render(() => {
            const url = "https://www.tcdw.net/post/" + (document.body.dataset.current || "") + "/";
            return Comment({ url });
        }, el);
    }
})();
