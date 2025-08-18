import { createEffect, Show, createSignal } from "solid-js";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { getPostsByURL } from "../../api/comment";
import { buildPostTree } from "../../utils/build-tree";
import { CommentForm } from "./CommentForm";
import { CommentGroup } from "./CommentGroup";
import type { PostSimple } from "../../types/comment";

interface CommentProps {
    url: string;
    title?: string;
    gravatarBaseUrl?: string;
    jumpOffset?: number;
    disableInfoSave?: boolean;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
    },
});

function CommentBase(props: CommentProps) {
    const [recaptchaSiteKey, setRecaptchaSiteKey] = createSignal<string | null>(null);
    const [recaptchaLoading, setRecaptchaLoading] = createSignal(false);

    const postsQuery = useQuery(() => ({
        queryKey: ["comments", props.url],
        queryFn: async () => {
            const { data: response } = await getPostsByURL(props.url);
            const postList = response.post || [];
            const tree = buildPostTree(postList);
            return {
                meta: response.meta,
                posts: tree,
            };
        },
        enabled: !!props.url,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    }));

    const handleSubmitSuccess = (_post: PostSimple) => {
        // Invalidate and refetch the query to get fresh data
        queryClient.invalidateQueries({ queryKey: ["comments", props.url] });
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

    // Check for reCAPTCHA site key and load script
    createEffect(() => {
        const recaptchaElement = document.getElementById("koi-recaptcha-site-key") as HTMLInputElement;
        if (recaptchaElement && recaptchaElement.value) {
            const siteKey = recaptchaElement.value;
            setRecaptchaSiteKey(siteKey);
            setRecaptchaLoading(true);

            // Load reCAPTCHA script if not already loaded
            if (!document.querySelector('script[src*="recaptcha"]')) {
                const script = document.createElement("script");
                script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
                script.async = true;
                script.defer = true;

                script.onload = () => {
                    // Wait for grecaptcha to be ready
                    if (window.grecaptcha && window.grecaptcha.ready) {
                        window.grecaptcha.ready(() => {
                            setRecaptchaLoading(false);
                        });
                    } else {
                        setRecaptchaLoading(false);
                    }
                };

                script.onerror = () => {
                    console.error("Failed to load reCAPTCHA script");
                    setRecaptchaLoading(false);
                };

                document.head.appendChild(script);
            } else {
                // Script already loaded, check if grecaptcha is ready
                if (window.grecaptcha && window.grecaptcha.ready) {
                    window.grecaptcha.ready(() => {
                        setRecaptchaLoading(false);
                    });
                } else {
                    setRecaptchaLoading(false);
                }
            }
        }
    });

    // Refetch when URL changes
    createEffect(() => {
        if (props.url && postsQuery.refetch) {
            postsQuery.refetch();
        }
    });

    return (
        <div class="text-black dark:text-white">
            <Show when={postsQuery.isSuccess && postsQuery.data}>
                <Show when={!postsQuery.data!.meta?.locked}>
                    <CommentForm
                        url={props.url}
                        title={props.title || document.title}
                        onSuccess={handleSubmitSuccess}
                        onError={handleSubmitError}
                        disableInfoSave={props.disableInfoSave}
                        recaptchaSiteKey={recaptchaSiteKey()}
                        recaptchaLoading={recaptchaLoading()}
                    />
                </Show>
                <Show when={postsQuery.data!.posts?.length > 0}>
                    <CommentGroup
                        posts={postsQuery.data!.posts}
                        meta={postsQuery.data!.meta}
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

            <Show when={postsQuery.isLoading}>
                <div class="text-center py-8 px-4">正在初始化评论系统……</div>
            </Show>

            <Show when={postsQuery.isError}>
                <div class="text-center py-8 px-4">
                    评论系统初始化失败。
                    <a
                        onClick={() => postsQuery.refetch()}
                        style={{ cursor: "pointer", "text-decoration": "underline" }}
                    >
                        重试？
                    </a>
                </div>
            </Show>
        </div>
    );
}

export function Comment(props: CommentProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <CommentBase {...props} />
        </QueryClientProvider>
    );
}
