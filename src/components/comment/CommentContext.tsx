import { createContext, useContext, JSX } from "solid-js";
import type { PostSimple, Meta } from "../../types/comment";

export interface CommentContextValue {
    url: string;
    title: string;
    meta?: Meta;
    gravatarBaseUrl?: string;
    jumpOffset?: number;
    disableInfoSave?: boolean;
    recaptchaSiteKey?: string | null;
    recaptchaLoading?: boolean;
    onSuccess?: (post: PostSimple) => void;
    onError?: (error: any) => void;
    onReplySuccess?: (post: PostSimple) => void;
    onReplyError?: (error: any) => void;
    onReplyCancel?: () => Promise<boolean>;
}

const CommentContext = createContext<CommentContextValue>();

export interface CommentProviderProps {
    children: JSX.Element;
    value: CommentContextValue;
}

export function CommentProvider(props: CommentProviderProps) {
    return <CommentContext.Provider value={props.value}>{props.children}</CommentContext.Provider>;
}

export function useCommentContext() {
    const context = useContext(CommentContext);
    if (!context) {
        throw new Error("useCommentContext must be used within a CommentProvider");
    }
    return context;
}
