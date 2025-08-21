import { For } from "solid-js";
import { CommentItem } from "./CommentItem";
import type { DisplayPost } from "../../types/comment";

interface CommentGroupProps {
    posts: DisplayPost[];
}

export function CommentGroup(props: CommentGroupProps) {
    return (
        <div class="space-y-6">
            <For each={props.posts}>
                {displayPost => (
                    <div class="mb-6">
                        <CommentItem comment={displayPost.parentPost} />
                        <For each={displayPost.childPost}>
                            {childComment => (
                                <div class="ms-6 sm:ms-8 mt-4">
                                    <CommentItem comment={childComment} />
                                </div>
                            )}
                        </For>
                    </div>
                )}
            </For>
        </div>
    );
}
