import { createSignal, createEffect, onMount, Show } from "solid-js";
import { getPostsByURL } from "../../api/comment";
import { buildPostTree, applyPostToTree } from "../../utils/build-tree";
import { CommentForm } from "./CommentForm";
import { CommentGroup } from "./CommentGroup";
import type { Meta, PostSimple, DisplayPost } from "../../types/comment";

interface CommentProps {
    url: string;
    title?: string;
    gravatarBaseUrl?: string;
    jumpOffset?: number;
    disableInfoSave?: boolean;
}

type ProgressState = "waiting" | "loading" | "success" | "failed";

export function Comment(props: CommentProps) {
    const [progress, setProgress] = createSignal<ProgressState>("waiting");
    const [meta, setMeta] = createSignal<Meta>();
    const [posts, setPosts] = createSignal<DisplayPost[]>([]);

    const doRequest = async () => {
        setProgress("loading");
        try {
            const { data: response } = await getPostsByURL(props.url);
            setMeta(response.meta);
            
            const postList = response.post || [];
            const tree = buildPostTree(postList);
            console.log(response);
            setPosts(tree);
            
            setProgress("success");
        } catch (error) {
            console.error("Failed to load comments:", error);
            setProgress("failed");
        }
    };

    const handleSubmitSuccess = (post: PostSimple) => {
        setPosts(prev => {
            const newTree = [...prev];
            applyPostToTree(post, newTree);
            return newTree;
        });
        // You can customize this success handler
        alert("评论发布成功！");
    };

    const handleSubmitError = (error: any) => {
        console.error("Failed to submit comment:", error);
        // You can customize this error handler
        alert("评论发布失败，请重试。");
    };

    const handleReplyCancel = async (): Promise<boolean> => {
        return confirm("确定要取消回复吗？已填写的内容将会丢失。");
    };

    onMount(() => {
        if (props.url) {
            doRequest();
        }
    });

    createEffect(() => {
        if (props.url) {
            doRequest();
        }
    });

    return (
        <div class="text-black dark:text-white">
            <Show when={progress() === "success"}>
                <Show when={!meta()?.locked}>
                    <CommentForm
                        url={props.url}
                        title={props.title || document.title}
                        onSuccess={handleSubmitSuccess}
                        onError={handleSubmitError}
                        disableInfoSave={props.disableInfoSave}
                    />
                </Show>
                <Show when={posts().length > 0}>
                    <CommentGroup
                        posts={posts()}
                        meta={meta()}
                        url={props.url}
                        title={props.title || document.title}
                        gravatarBaseUrl={props.gravatarBaseUrl}
                        jumpOffset={props.jumpOffset}
                        onReplySuccess={handleSubmitSuccess}
                        onReplyError={handleSubmitError}
                        onReplyCancel={handleReplyCancel}
                        disableInfoSave={props.disableInfoSave}
                    />
                </Show>
            </Show>
            
            <Show when={progress() === "loading"}>
                <div class="text-center py-8 px-4">
                    正在初始化评论系统……
                </div>
            </Show>
            
            <Show when={progress() === "failed"}>
                <div class="text-center py-8 px-4">
                    评论系统初始化失败。
                    <a onClick={doRequest} style="cursor: pointer; text-decoration: underline;">重试？</a>
                </div>
            </Show>
        </div>
    );
}
