import { ofetch } from "ofetch";
import type { PostMeta, ResponseRoot } from "../types/archive";

export async function listPost(): Promise<ResponseRoot<PostMeta[]>> {
  return ofetch("/control/list/post");
}
