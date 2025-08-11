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
            class={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 ${props.class || ""}`}
            rows={3}
        />
    );
}
