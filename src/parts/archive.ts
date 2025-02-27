import {mount} from "svelte";

(async () => {
    if (document.body.dataset.current === "archive") {
        const Archive = (await import("../components/Archive.svelte")).default;
        mount(Archive, {
            target: document.querySelector(".prose")!,
        })
    }
})();
