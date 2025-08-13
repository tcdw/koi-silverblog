import { createSignal, onMount, JSX } from "solid-js";
import { addPost } from "../../api/comment";
import { getPommentDefaultUser, setPommentDefaultUser } from "../../utils/storage";
import { CommentInput } from "./CommentInput";
import { CommentTextarea } from "./CommentTextarea";
import { CommentFormItem } from "./CommentFormItem";
import type { AddPostRequest, PostSimple } from "../../types/comment";

interface CommentFormProps {
    targetId?: string;
    url: string;
    title: string;
    onSuccess?: (post: PostSimple) => void;
    onError?: (error: any) => void;
    disableInfoSave?: boolean;
}

export function CommentForm(props: CommentFormProps) {
    const [loading, setLoading] = createSignal(false);
    const [hasSettings, setHasSettings] = createSignal(false);
    const [formData, setFormData] = createSignal({
        name: "",
        email: "",
        website: "",
        content: "",
        receiveEmail: false
    });

    const updateFormData = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };



    const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const { name, email, website, content, receiveEmail } = formData();

            const requestBody: AddPostRequest = {
                url: props.url,
                title: props.title,
                name,
                email,
                website: website || undefined,
                content,
                receiveEmail,
                parent: props.targetId
            };

            const { data: result } = await addPost(requestBody);
            
            // Save user info if not disabled
            if (!props.disableInfoSave) {
                setPommentDefaultUser({ name, email, website });
            }

            // Reset form
            setFormData({
                name: hasSettings() ? name : "",
                email: hasSettings() ? email : "",
                website: hasSettings() ? website : "",
                content: "",
                receiveEmail: false
            });

            props.onSuccess?.(result);
        } catch (error) {
            props.onError?.(error);
        } finally {
            setLoading(false);
        }
    };

    onMount(() => {
        if (!props.disableInfoSave) {
            const userInfo = getPommentDefaultUser();
            if (userInfo) {
                setHasSettings(true);
                setFormData(prev => ({
                    ...prev,
                    name: userInfo.name,
                    email: userInfo.email,
                    website: userInfo.website
                }));
            }
        }
    });

    return (
        <form class="space-y-4 my-6" onSubmit={handleSubmit}>
            {hasSettings() ? (
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div>以 <strong>{formData().name}</strong> 的身份评论</div>
                    <div>
                        <button
                            type="button"
                            onClick={() => setHasSettings(false)}
                        >
                            更改
                        </button>
                    </div>
                </div>
            ) : (
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <CommentFormItem label="昵称" required for={`pomment-name__${props.targetId || 'root'}`}>
                        <CommentInput
                            id={`pomment-name__${props.targetId || 'root'}`}
                            value={formData().name}
                            onInput={(value) => updateFormData('name', value)}
                            autocomplete="name"
                            required
                        />
                    </CommentFormItem>
                    <CommentFormItem label="邮箱" required for={`pomment-email__${props.targetId || 'root'}`}> 
                        <CommentInput
                            id={`pomment-email__${props.targetId || 'root'}`}
                            value={formData().email}
                            onInput={(value) => updateFormData('email', value)}
                            type="email"
                            autocomplete="email"
                            required
                        />
                    </CommentFormItem>
                    <CommentFormItem label="网站" for={`pomment-website__${props.targetId || 'root'}`}>
                        <CommentInput
                            id={`pomment-website__${props.targetId || 'root'}`}
                            value={formData().website}
                            onInput={(value) => updateFormData('website', value)}
                            type="url"
                            autocomplete="url"
                        />
                    </CommentFormItem>
                </div>
            )}
            
            <CommentFormItem label="评论" required for={`pomment-comment__${props.targetId || 'root'}`}>
                <CommentTextarea
                    id={`pomment-comment__${props.targetId || 'root'}`}
                    value={formData().content}
                    onInput={(value) => updateFormData('content', value)}
                    autoHeight
                    required
                />
            </CommentFormItem>
            
            <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <button
                    type="submit"
                    class="block rounded-md bg-primary-600 px-4 py-2 text-center text-base font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    disabled={loading()}
                >
                    {loading() ? "发布中……" : "发布评论"}
                </button>
                <div class="flex items-center">
                    <input checked id={`pomment-receive-email__${props.targetId || 'root'}`} type="checkbox" value="" class="w-5 h-5" />
                    <label for={`pomment-receive-email__${props.targetId || 'root'}`} class="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">接收邮件通知</label>
                </div>
            </div>
        </form>
    );
}
