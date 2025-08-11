import { createSignal, Show } from "solid-js";
import { CommentForm } from "./CommentForm";
import { CommentDateTime } from "./CommentDateTime";
import { getAvatarUrl, getAvatarSrcset } from "../../utils/format";
import type { PostSimple, Meta } from "../../types/comment";

interface CommentItemProps {
    comment: PostSimple;
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

const AVATAR_SIZE = 70;
const AVATAR_SIZE_SMALL = 30;

export function CommentItem(props: CommentItemProps) {
    const [opened, setOpened] = createSignal(false);

    const href = () => {
        const { website } = props.comment;
        if (!website) return undefined;
        if (website.startsWith("http://") || website.startsWith("https://")) {
            return website;
        }
        return undefined;
    };

    const avatar = (small = false) => {
        if (props.comment.avatar) {
            return props.comment.avatar;
        }
        const size = small ? AVATAR_SIZE_SMALL : AVATAR_SIZE;
        return getAvatarUrl(
            props.comment.emailHashed, 
            size, 
            props.gravatarBaseUrl || 'https://secure.gravatar.com/avatar/'
        );
    };

    const avatarSrcset = (small = false) => {
        if (props.comment.avatar) {
            return props.comment.avatar;
        }
        const size = small ? AVATAR_SIZE_SMALL : AVATAR_SIZE;
        return getAvatarSrcset(
            props.comment.emailHashed, 
            size, 
            props.gravatarBaseUrl || 'https://secure.gravatar.com/avatar/'
        );
    };

    const handleToParent = () => {
        const el = document.getElementById(`comment-${props.comment.parentPost?.id}`);
        if (!el) return;
        
        const jumpOffset = props.jumpOffset ? Number(props.jumpOffset) : 0;
        const target = el.getBoundingClientRect().y + window.scrollY - jumpOffset - 15;
        window.scrollTo({
            top: target,
            behavior: "smooth"
        });
    };

    const handleReply = async () => {
        if (opened()) {
            // Check if form has content before closing
            const shouldCancel = await props.onReplyCancel?.();
            if (shouldCancel !== false) {
                setOpened(false);
            }
        } else {
            setOpened(true);
        }
    };

    return (
        <div class="pomment-comment-wrapper__parent">
            <div
                id={`comment-${props.comment.id}`}
                class={`pomment-comment ${props.meta?.locked ? 'is-meta-locked' : ''}`}
            >
                <div class="pomment-comment__left">
                    <div class="pomment-comment__avatar">
                        <img
                            src={avatar()}
                            srcset={avatarSrcset()}
                            alt={`${props.comment.name}'s avatar`}
                            style={{ width: `${AVATAR_SIZE}px`, height: `${AVATAR_SIZE}px` }}
                        />
                    </div>
                </div>
                <div class="pomment-comment__right">
                    <div class="pomment-comment__top">
                        <img
                            src={avatar(true)}
                            srcset={avatarSrcset(true)}
                            alt={`${props.comment.name}'s avatar`}
                            style={{ width: `${AVATAR_SIZE_SMALL}px`, height: `${AVATAR_SIZE_SMALL}px` }}
                        />
                        <Show
                            when={href()}
                            fallback={
                                <span class={`pomment-comment__name ${props.comment.byAdmin ? 'is-admin' : ''}`}>
                                    {props.comment.name}
                                </span>
                            }
                        >
                            <a
                                href={href()}
                                target="_blank"
                                rel="noopener noreferrer"
                                class={`pomment-comment__name ${props.comment.byAdmin ? 'is-admin' : ''}`}
                            >
                                {props.comment.name}
                            </a>
                        </Show>
                        <Show when={props.comment.byAdmin}>
                            <div class="pomment-comment__admin">MOD</div>
                        </Show>
                        <CommentDateTime
                            class="pomment-comment__date"
                            datetime={props.comment.createdAt}
                        />
                    </div>
                    <div class="pomment-comment__content">
                        <Show when={props.comment.parentPost}>
                            <a
                                class="pomment-comment__reply-to"
                                onClick={handleToParent}
                            >
                                @{props.comment.parentPost?.name}
                            </a>
                        </Show>
                        {props.comment.content}
                    </div>
                    <Show when={!props.meta?.locked}>
                        <div class="pomment-comment__action">
                            <button onClick={handleReply}>
                                {opened() ? "取消回复" : "回复"}
                            </button>
                        </div>
                    </Show>
                </div>
            </div>
            <Show when={opened()}>
                <CommentForm
                    targetId={props.comment.id}
                    url={props.url}
                    title={props.title}
                    onSuccess={(post) => {
                        setOpened(false);
                        props.onReplySuccess?.(post);
                    }}
                    onError={props.onReplyError}
                    disableInfoSave={props.disableInfoSave}
                />
            </Show>
        </div>
    );
}
