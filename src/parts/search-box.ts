import SearchBox from "../components/SearchBox.svelte";
import {exec, SEARCH_READY_PROMISE} from "../utils/search.ts";
import sqlString from "sqlstring-sqlite";

new SearchBox({
    target: document.getElementById("koi-search-box-host")!
});

(async () => {
    await SEARCH_READY_PROMISE;
    const keyword = "手机 XZ 水";
    const splitKeyword = keyword.split(" ").map((e) => `%${e}%`);
    const result = await exec(sqlString.format("SELECT * FROM posts WHERE `content` LIKE ? " + ("AND `content` LIKE ? ").repeat(splitKeyword.length - 1), splitKeyword));
    console.log(result);
})();
