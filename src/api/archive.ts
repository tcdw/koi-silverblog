import type { PostMeta, ResponseRoot } from "../types/archive";

export async function listPost(): Promise<ResponseRoot<PostMeta[]>> {
    const res = await fetch("/control/list/post", {
        method: "get",
    });
    return res.json();
}
