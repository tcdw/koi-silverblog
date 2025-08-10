import { JSX } from "solid-js";

interface CommentFormItemProps {
    label: string;
    required?: boolean;
    children: JSX.Element;
}

export function CommentFormItem(props: CommentFormItemProps) {
    return (
        <div class="pomment-form-item">
            <label class="pomment-form-item__label">
                {props.label}
                {props.required && <span class="pomment-form-item__required">*</span>}
            </label>
            <div class="pomment-form-item__content">
                {props.children}
            </div>
        </div>
    );
}
