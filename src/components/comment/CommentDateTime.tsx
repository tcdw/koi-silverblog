import { formatDateTime } from "../../utils/format";

interface CommentDateTimeProps {
    datetime: number;
    class?: string;
}

export function CommentDateTime(props: CommentDateTimeProps) {
    return (
        <time 
            class={`pomment-datetime ${props.class || ""}`}
            dateTime={new Date(props.datetime).toISOString()}
        >
            {formatDateTime(props.datetime)}
        </time>
    );
}
