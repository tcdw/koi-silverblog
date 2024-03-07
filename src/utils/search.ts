import type { QueryExecResult } from "sql.js";
import sqlString from "sqlstring-sqlite";
import {
    openDB,
    type DBSchema
} from 'idb';

class SearchReady {
    promise: Promise<void>;
    resolve: () => void = () => {};
    reject: () => void = () => {};

    constructor() {
        this.promise = new Promise<void>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

export const searchReady = new SearchReady();

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
    if (process.env.NODE_ENV !== "production") {
        console.log("执行 SQL 语句", sql);
    }
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
    await searchReady.promise;
    const splitKeyword = keyword.trim().split(" ").map((e) => `%${e}%`);
    if (splitKeyword.length === 1 && splitKeyword[0] === "%%") {
        return [];
    }
    const result = await exec(
        sqlString.format(`SELECT name, title, excerpt
                          FROM posts
                          WHERE (\`content\` LIKE ? ${("AND `content` LIKE ? ").repeat(splitKeyword.length - 1)})
                          OR (\`title\` LIKE ? ${"AND \`title\` LIKE ? ".repeat(splitKeyword.length - 1)})`, [...splitKeyword, ...splitKeyword])
    );
    return resultToArray<SearchResult>(result[0]);
}

function initDatabase(buffer: ArrayBuffer) {
    worker.onmessage = () => {
        searchReady.resolve();
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
}

interface KoiSearchData extends DBSchema {
    'koi-search': {
        key: string;
        value: {
            data: ArrayBuffer;
            version: string;
        };
    };
}

// 数据库初始化
(async () => {
    const db = await openDB<KoiSearchData>("koi-search-data", 1, {
        upgrade(db) {
            db.createObjectStore('koi-search');
        }
    });
    const searchData = await db.get("koi-search", "data");
    if (searchData) {
        try {
            const res = await fetch("/search/search.db", {
                method: "head",
            });
            if (res.status !== 200) {
                console.warn(`缓存校验失败！服务端返回了 ${res.status}`);
            }
            if (res.headers.get("Last-Modified") === searchData.version) {
                initDatabase(searchData.data);
                db.close();
                return;
            }
        } catch (e) {
            console.warn("缓存校验失败！", e);
        }
    }
    console.log("正在下载最新版本数据库……");
    const res = await fetch("/search/search.db");
    const version = res.headers.get("Last-Modified") ?? "";
    const data = await res.arrayBuffer();
    initDatabase(data);
    await db.put("koi-search", { version, data }, "data");
    db.close();
})();
