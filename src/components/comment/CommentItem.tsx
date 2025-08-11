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
        <div class="mb-6">
            <div
                id={`comment-${props.comment.id}`}
                class={`flex ${props.meta?.locked ? 'pb-3' : ''}`}
            >
                <div class="flex-shrink-0 mr-[17.5px] hidden sm:block">
                    <div>
                        <img
                            class="rounded-lg block shadow-xl bg-white dark:brightness-50 dark:hover:brightness-100 transition-all"
                            src={avatar()}
                            srcset={avatarSrcset()}
                            alt={`${props.comment.name}'s avatar`}
                            style={{ width: `${AVATAR_SIZE}px`, height: `${AVATAR_SIZE}px` }}
                        />
                    </div>
                </div>
                <div class="w-full">
                    <div class="flex items-center mb-2">
                        <img
                            class="rounded-lg me-3 block sm:hidden shadow-xl bg-white dark:brightness-50 dark:hover:brightness-100 transition-all"
                            src={avatar(true)}
                            srcset={avatarSrcset(true)}
                            alt={`${props.comment.name}'s avatar`}
                            style={{ width: `${AVATAR_SIZE_SMALL}px`, height: `${AVATAR_SIZE_SMALL}px` }}
                        />
                        <Show
                            when={href()}
                            fallback={
                                <span class={`font-bold text-base`}>
                                    {props.comment.name}
                                </span>
                            }
                        >
                            <a
                                href={href()}
                                target="_blank"
                                rel="noopener noreferrer"
                                class={`font-bold text-base text-primary-600 dark:text-primary-400 hover:underline`}
                            >
                                {props.comment.name}
                            </a>
                        </Show>
                        <Show when={props.comment.byAdmin}>
                            <div class="ms-2 sm:ms-2.5 px-2 py-1 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900 rounded">MOD</div>
                        </Show>
                        <CommentDateTime
                            class="ml-auto text-sm text-gray-500 dark:text-gray-400"
                            datetime={props.comment.createdAt}
                        />
                    </div>
                    <div class="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                        <Show when={props.comment.parentPost}>
                            <button
                                class="font-bold text-primary-600 dark:text-primary-400 cursor-pointer hover:underline me-1.5"
                                onClick={handleToParent}
                            >
                                @{props.comment.parentPost?.name}
                            </button>
                        </Show>
                        {props.comment.content}
                    </div>
                    <Show when={!props.meta?.locked}>
                        <div class="pt-2.5 mt-2.5 border-t border-gray-200 dark:border-gray-700">
                            <button 
                                class="text-base text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
                                onClick={handleReply}
                            >
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
