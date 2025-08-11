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
            class={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 ${props.class || ""}`}
        />
    );
}
