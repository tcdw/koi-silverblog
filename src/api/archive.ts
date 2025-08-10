import { ofetch } from "ofetch";
import type { PostMeta } from "../types/archive";
import { ResponseRoot } from "../types/api";

export async function listPost(): Promise<ResponseRoot<PostMeta[]>> {
  return ofetch("/control/list/post");
}
