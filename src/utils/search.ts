import type { QueryExecResult } from "sql.js";

let searchReadyPromiseResolve: () => void;

export const SEARCH_READY_PROMISE = new Promise<void>((resolve) => {
    searchReadyPromiseResolve = resolve;
});

const worker = new Worker("/public/dist/vendors/sql.js/worker.sql-wasm.js");

let promiseCount = 1;
const promisePool = new Map<number, { resolve: (value: any) => void, reject: (e: any) => void }>();

export function exec(sql: string) {
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
