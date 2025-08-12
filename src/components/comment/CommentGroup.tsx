import { For } from "solid-js";
import { CommentItem } from "./CommentItem";
import type { DisplayPost, Meta, PostSimple } from "../../types/comment";

interface CommentGroupProps {
    posts: DisplayPost[];
    meta?: Meta;
    url: string;
    title: string;
    gravatarBaseUrl?: string;
    jumpOffset?: number;
    onReplySuccess?: (post: PostSimple) => void;
    onReplyError?: (error: any) => void;
    onReplyCancel?: () => Promise<boolean>;
    disableInfoSave?: boolean;
}

export function CommentGroup(props: CommentGroupProps) {
    return (
        <div class="space-y-6">
            <For each={props.posts}>
                {(displayPost) => (
                    <div class="mb-6">
                        <CommentItem
                            comment={displayPost.parentPost}
                            meta={props.meta}
                            url={props.url}
                            title={props.title}
                            gravatarBaseUrl={props.gravatarBaseUrl}
                            jumpOffset={props.jumpOffset}
                            onReplySuccess={props.onReplySuccess}
                            onReplyError={props.onReplyError}
                            onReplyCancel={props.onReplyCancel}
                            disableInfoSave={props.disableInfoSave}
                        />
                        <For each={displayPost.childPost}>
                            {(childComment) => (
                                <div class="ms-6 sm:ms-8 mt-4">
                                    <CommentItem
                                        comment={childComment}
                                        meta={props.meta}
                                        url={props.url}
                                        title={props.title}
                                        gravatarBaseUrl={props.gravatarBaseUrl}
                                        jumpOffset={props.jumpOffset}
                                        onReplySuccess={props.onReplySuccess}
                                        onReplyError={props.onReplyError}
                                        onReplyCancel={props.onReplyCancel}
                                        disableInfoSave={props.disableInfoSave}
                                    />
                                </div>
                            )}
                        </For>
                    </div>
                )}
            </For>
        </div>
    );
}
