import type { QueryExecResult } from "sql.js";
import sqlString from "sqlstring-sqlite";

let searchReadyPromiseResolve: () => void;

export const SEARCH_READY_PROMISE = new Promise<void>((resolve) => {
    searchReadyPromiseResolve = resolve;
});

const worker = new Worker("/public/dist/vendors/sql.js/worker.sql-wasm.js");

let promiseCount = 1;
const promisePool = new Map<number, { resolve: (value: any) => void, reject: (e: any) => void }>();

export function resultToArray<T = any>(result: QueryExecResult): T[] {
    if (!result) {
        return [];
    }
    const output: T[] = [];
    result.values.forEach((e) => {
        const constructed: any = {};
        result.columns.forEach((f, j) => {
            constructed[f] = e[j];
        })
        output.push(constructed);
    })
    return output;
}

export function exec(sql: string) {
    console.log("执行 SQL 语句", sql);
    promiseCount++;
    worker.postMessage({
        id: promiseCount,
        action: "exec",
        sql,
    });
    return new Promise<QueryExecResult[]>((resolve, reject) => {
        promisePool.set(promiseCount, { resolve, reject });
    });
}

export interface SearchResult {
    name: string
    title: string
    excerpt: string
}

export async function searchKeyword(keyword: string) {
    await SEARCH_READY_PROMISE;
    const splitKeyword = keyword.trim().split(" ").map((e) => `%${e}%`);
    if (splitKeyword.length === 1 && splitKeyword[0] === "%%") {
        return [];
    }
    const result = await exec(
        sqlString.format(`SELECT name, title, excerpt, createtime
                          FROM posts
                          WHERE \`content\` LIKE ? ${("AND `content` LIKE ? ").repeat(splitKeyword.length - 1)}
                          ${"AND \`title\` LIKE ? ".repeat(splitKeyword.length)}`, [...splitKeyword, ...splitKeyword])
    );
    return resultToArray<SearchResult>(result[0]);
}

fetch("/search/search.db").then((e) => {
    return e.arrayBuffer();
}).then((buffer) => {
    worker.onmessage = () => {
        searchReadyPromiseResolve();
        worker.onmessage = (event) => {
            const { data } = event;
            const got = promisePool.get(data.id);
            if (!got) {
                console.warn(`Received message with invalid ID ${data.id}`);
                return;
            }
            if (data.error) {
                got.reject(new Error(data.error));
            } else {
                got.resolve(data.results);
            }
            promisePool.delete(data.id);
        };
    };
    worker.onerror = e => console.error("Worker error: ", e);
    worker.postMessage({
        id: 1,
        action: "open",
        buffer,
    });
});
