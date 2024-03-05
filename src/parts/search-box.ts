import SearchBox from "../components/SearchBox.svelte";
import {exec, SEARCH_READY_PROMISE} from "../utils/search.ts";

new SearchBox({
    target: document.getElementById("koi-search-box-host")!
});

(async () => {
    await SEARCH_READY_PROMISE;
    const result = await exec("SELECT * FROM posts WHERE `content` LIKE '%IE%'");
    console.log(result);
})();
