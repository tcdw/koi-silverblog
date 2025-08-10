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
            const response = await getPostsByURL(props.url);
            setMeta(response.meta);
            
            const postList = response.post || [];
            const tree = buildPostTree(postList);
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
        alert("Comment submitted successfully!");
    };

    const handleSubmitError = (error: any) => {
        console.error("Failed to submit comment:", error);
        // You can customize this error handler
        alert("Failed to submit comment. Please try again.");
    };

    const handleReplyCancel = async (): Promise<boolean> => {
        return confirm("Are you sure you want to cancel replying? Your content will be lost.");
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
        <div class="pomment-widget text-black dark:text-white">
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
                <div class="pomment-widget__loading">
                    Initializing Pomment ...
                </div>
            </Show>
            
            <Show when={progress() === "failed"}>
                <div class="pomment-widget__error">
                    Failed to initialize Pomment. 
                    <a onClick={doRequest} style="cursor: pointer; text-decoration: underline;">Retry?</a>
                </div>
            </Show>
        </div>
    );
}
