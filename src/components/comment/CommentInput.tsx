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
            class={`pomment-input ${props.class || ""}`}
        />
    );
}
