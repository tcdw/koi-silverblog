import { createSignal, onMount, JSX, Show } from "solid-js";
import { addPost } from "../../api/comment";
import { getPommentDefaultUser, setPommentDefaultUser } from "../../utils/storage";
import { CommentInput } from "./CommentInput";
import { CommentTextarea } from "./CommentTextarea";
import { CommentFormItem } from "./CommentFormItem";
import { useCommentContext } from "./CommentContext";
import type { AddPostRequest } from "../../types/comment";

interface CommentFormProps {
  targetId?: string;
}

export function CommentForm(props: CommentFormProps) {
  const context = useCommentContext();
  const [loading, setLoading] = createSignal(false);
  const [hasSettings, setHasSettings] = createSignal(false);
  const [formData, setFormData] = createSignal({
    name: "",
    email: "",
    website: "",
    content: "",
    receiveEmail: false,
  });

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async e => {
    e.preventDefault();

    try {
      setLoading(true);
      const { name, email, website, content, receiveEmail } = formData();

      let challengeResponse: string | undefined = undefined;

      // Get reCAPTCHA token if site key is provided
      if (context.recaptchaSiteKey && window.grecaptcha) {
        try {
          challengeResponse = await window.grecaptcha.execute(context.recaptchaSiteKey, {
            action: "submit_comment",
          });
        } catch (error) {
          console.error("Failed to get reCAPTCHA token:", error);
          throw new Error("人机验证失败，请重试");
        }
      }

      const requestBody: AddPostRequest = {
        url: context.url,
        title: context.title,
        name,
        email,
        website: website || undefined,
        content,
        receiveEmail,
        parent: props.targetId,
        challengeResponse,
      };

      const { data: result } = await addPost(requestBody);

      // Save user info if not disabled
      if (!context.disableInfoSave) {
        setPommentDefaultUser({ name, email, website });
      }

      // Reset form
      setFormData({
        name: hasSettings() ? name : "",
        email: hasSettings() ? email : "",
        website: hasSettings() ? website : "",
        content: "",
        receiveEmail: false,
      });

      context.onSuccess?.(result);
    } catch (error) {
      context.onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    if (!context.disableInfoSave) {
      const userInfo = getPommentDefaultUser();
      if (userInfo) {
        setHasSettings(true);
        setFormData(prev => ({
          ...prev,
          name: userInfo.name,
          email: userInfo.email,
          website: userInfo.website,
        }));
      }
    }
  });

  return (
    <form class="space-y-4 my-6" onSubmit={handleSubmit}>
      {hasSettings() ? (
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
          <div>
            以 <strong>{formData().name}</strong> 的身份评论
          </div>
          <div>
            <button type="button" onClick={() => setHasSettings(false)}>
              更改
            </button>
          </div>
        </div>
      ) : (
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CommentFormItem label="昵称" required for={`pomment-name__${props.targetId || "root"}`}>
            <CommentInput
              id={`pomment-name__${props.targetId || "root"}`}
              value={formData().name}
              onInput={value => updateFormData("name", value)}
              autocomplete="name"
              required
            />
          </CommentFormItem>
          <CommentFormItem label="邮箱" required for={`pomment-email__${props.targetId || "root"}`}>
            <CommentInput
              id={`pomment-email__${props.targetId || "root"}`}
              value={formData().email}
              onInput={value => updateFormData("email", value)}
              type="email"
              autocomplete="email"
              required
            />
          </CommentFormItem>
          <CommentFormItem label="网站" for={`pomment-website__${props.targetId || "root"}`}>
            <CommentInput
              id={`pomment-website__${props.targetId || "root"}`}
              value={formData().website}
              onInput={value => updateFormData("website", value)}
              type="url"
              autocomplete="url"
            />
          </CommentFormItem>
        </div>
      )}

      <CommentFormItem label="评论" required for={`pomment-comment__${props.targetId || "root"}`}>
        <CommentTextarea
          id={`pomment-comment__${props.targetId || "root"}`}
          value={formData().content}
          onInput={value => updateFormData("content", value)}
          autoHeight
          required
        />
      </CommentFormItem>
      <Show when={context.recaptchaSiteKey}>
        <div class="text-sm leading-normal opacity-60">
          This site is protected by reCAPTCHA and the Google&nbsp;
          <a class="underline" href="https://policies.google.com/privacy">
            Privacy Policy
          </a>{" "}
          and&nbsp;
          <a class="underline" href="https://policies.google.com/terms">
            Terms of Service
          </a>{" "}
          apply.
        </div>
      </Show>
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <button
          type="submit"
          class="block rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading() || (Boolean(context.recaptchaSiteKey) && Boolean(context.recaptchaLoading))}
          // disabled
        >
          {loading() ? "发布中……" : context.recaptchaSiteKey && context.recaptchaLoading ? "正在初始化……" : "发布评论"}
        </button>
        <div class="flex items-center">
          <input
            checked
            id={`pomment-receive-email__${props.targetId || "root"}`}
            type="checkbox"
            value=""
            class="size-4"
          />
          <label
            for={`pomment-receive-email__${props.targetId || "root"}`}
            class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            接收邮件通知
          </label>
        </div>
      </div>
    </form>
  );
}
