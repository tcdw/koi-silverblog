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

            const result = await addPost(requestBody);
            
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
        <form class="pomment-form" onSubmit={handleSubmit}>
            {hasSettings() ? (
                <div class="pomment-form__settings">
                    <div>Commenting as <strong>{formData().name}</strong></div>
                    <div>
                        <button
                            type="button"
                            onClick={() => setHasSettings(false)}
                        >
                            Change
                        </button>
                    </div>
                </div>
            ) : (
                <div class="pomment-form__grid">
                    <CommentFormItem label="Name" required>
                        <CommentInput
                            id={`pomment-name__${props.targetId || 'root'}`}
                            value={formData().name}
                            onInput={(value) => updateFormData('name', value)}
                            autocomplete="name"
                            required
                        />
                    </CommentFormItem>
                    <CommentFormItem label="Email" required>
                        <CommentInput
                            id={`pomment-email__${props.targetId || 'root'}`}
                            value={formData().email}
                            onInput={(value) => updateFormData('email', value)}
                            type="email"
                            autocomplete="email"
                            required
                        />
                    </CommentFormItem>
                    <CommentFormItem label="Website">
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
            
            <CommentFormItem label="Comment" required>
                <CommentTextarea
                    id={`pomment-comment__${props.targetId || 'root'}`}
                    value={formData().content}
                    onInput={(value) => updateFormData('content', value)}
                    autoHeight
                    required
                />
            </CommentFormItem>
            
            <div class="pomment-form__action">
                <button
                    type="submit"
                    class="pomment-button pomment-button--primary"
                    disabled={loading()}
                >
                    {loading() ? "Submitting..." : "Submit"}
                </button>
                <div>
                    <input
                        id={`pomment-receive-email__${props.targetId || 'root'}`}
                        type="checkbox"
                        checked={formData().receiveEmail}
                        onChange={(e) => updateFormData('receiveEmail', e.currentTarget.checked)}
                        class="magic-checkbox"
                        name="layout"
                    />
                    <label for={`pomment-receive-email__${props.targetId || 'root'}`}>
                        Receive Email
                    </label>
                </div>
            </div>
        </form>
    );
}
