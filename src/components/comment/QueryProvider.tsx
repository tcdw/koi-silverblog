import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import type { Component } from "solid-js";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
    },
});

interface QueryProviderProps {
    children: any;
}

export const QueryProvider: Component<QueryProviderProps> = props => {
    return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
};
