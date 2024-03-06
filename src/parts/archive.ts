(async () => {
    if (document.body.dataset.current === "archive") {
        const Archive = (await import("../components/Archive.svelte")).default;
        new Archive({
            target: document.querySelector(".prose")!,
        })
    }
})();
