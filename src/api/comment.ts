import { ofetch } from "ofetch";
import { AddPostRequest, GetPostsResponse, PostSimple } from "../types/comment";
import { ResponseRoot } from "../types/api";

export async function getPostsByURL(url: string) {
  return ofetch<ResponseRoot<GetPostsResponse>>("/plugin/pomment/public/posts/byUrl", {
    method: "POST",
    body: {
      url,
    },
  });
}

export async function addPost(body: AddPostRequest) {
  return ofetch<ResponseRoot<PostSimple>>("/plugin/pomment/public/posts/add", {
    method: "POST",
    body,
  });
}
