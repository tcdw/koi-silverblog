import { JSX } from "solid-js";

interface CommentInputProps {
    id?: string;
    value: string;
    onInput: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    type?: string;
    autocomplete?: string;
    class?: string;
}

export function CommentInput(props: CommentInputProps) {
    const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        props.onInput(e.currentTarget.value);
    };

    return (
        <input
            id={props.id}
            type={props.type || "text"}
            value={props.value}
            onInput={handleInput}
            placeholder={props.placeholder}
            required={props.required}
            autocomplete={props.autocomplete}
            class={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 ${props.class || ""}`}
        />
    );
}
