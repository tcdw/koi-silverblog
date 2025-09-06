import { formatDateTime } from "../../utils/format";

interface CommentDateTimeProps {
  datetime: number;
  class?: string;
}

export function CommentDateTime(props: CommentDateTimeProps) {
  return (
    <time
      class={`text-sm text-gray-500 dark:text-gray-400 ${props.class || ""}`}
      dateTime={new Date(props.datetime).toISOString()}
    >
      {formatDateTime(props.datetime)}
    </time>
  );
}
