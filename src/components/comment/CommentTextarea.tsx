import { JSX, onMount, createEffect } from "solid-js";

interface CommentTextareaProps {
    id?: string;
    value: string;
    onInput: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    autoHeight?: boolean;
    class?: string;
}

export function CommentTextarea(props: CommentTextareaProps) {
    let textareaRef: HTMLTextAreaElement | undefined;

    const handleInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = (e) => {
        props.onInput(e.currentTarget.value);
        if (props.autoHeight) {
            adjustHeight();
        }
    };

    const adjustHeight = () => {
        if (textareaRef) {
            textareaRef.style.height = 'auto';
            textareaRef.style.height = textareaRef.scrollHeight + 'px';
        }
    };

    onMount(() => {
        if (props.autoHeight) {
            adjustHeight();
        }
    });

    createEffect(() => {
        if (props.autoHeight && props.value) {
            setTimeout(adjustHeight, 0);
        }
    });

    return (
        <textarea
            ref={textareaRef}
            id={props.id}
            value={props.value}
            onInput={handleInput}
            placeholder={props.placeholder}
            required={props.required}
            class={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 resize-none ${props.class || ""}`}
            rows={3}
        />
    );
}
