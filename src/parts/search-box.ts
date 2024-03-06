import SearchBox from "../components/SearchBox.svelte";
import {exec, resultToArray, SEARCH_READY_PROMISE} from "../utils/search.ts";
import sqlString from "sqlstring-sqlite";

new SearchBox({
    target: document.getElementById("koi-search-box-host")!
});

(async () => {
    await SEARCH_READY_PROMISE;
    const keyword = "手机 XZ";
    const splitKeyword = keyword.trim().split(" ").map((e) => `%${e}%`);
    const result = await exec(
        sqlString.format(`SELECT name, title, excerpt, createtime
                          FROM posts
                          WHERE \`content\` LIKE ? ${("AND `content` LIKE ? ").repeat(splitKeyword.length - 1)}`, splitKeyword)
    );
    console.log(resultToArray(result[0]));
})();
