import { JSX } from "solid-js";

interface CommentFormItemProps {
    label: string;
    required?: boolean;
    children: JSX.Element;
}

export function CommentFormItem(props: CommentFormItemProps) {
    return (
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {props.label}
                {props.required && <span class="text-red-500">*</span>}
            </label>
            <div>
                {props.children}
            </div>
        </div>
    );
}
