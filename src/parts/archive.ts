import Archive from "../components/Archive.svelte";

if (document.body.dataset.current === "archive") {
    new Archive({
        target: document.querySelector(".prose")!,
    })
}
