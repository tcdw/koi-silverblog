import { ofetch } from "ofetch";
import { AddPostRequest, GetPostsResponse, PostSimple } from "../types/comment";

export async function getPostsByURL(url: string) {
    return ofetch<GetPostsResponse>("/public/posts/byUrl", {
        method: "POST",
        body: {
            url,
        },
    });
}

export async function addPost(body: AddPostRequest) {
    return ofetch<PostSimple>("/public/posts/add", {
        method: "POST",
        body,
    });
}
