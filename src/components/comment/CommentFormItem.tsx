import { JSX } from "solid-js";

interface CommentFormItemProps {
    label: string;
    for: string;
    required?: boolean;
    children: JSX.Element;
}

export function CommentFormItem(props: CommentFormItemProps) {
    return (
        <div>
            <label for={props.for} class="block text-base font-semibold text-gray-900 mb-2">
                {props.label}
                {props.required && <span class="text-red-500 ms-0.5">*</span>}
            </label>
            <div>{props.children}</div>
        </div>
    );
}
