import { RouterProvider } from "@tanstack/react-router";
import { router } from "./utils/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { trpc } from "./utils/trpc";
import { httpBatchLink } from "@trpc/client";
import { useJwtStore } from "./stores/jwtStore";

const App = () => {
    const jwtStore = useJwtStore();
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: "http://localhost:3001/api",
                    headers() {
                        return {
                            Authorization: jwtStore.getAccessToken(),
                            "Api-Version": "1.0.0"
                        };
                    }
                })
            ]
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </trpc.Provider>
    );
};

export default App;
