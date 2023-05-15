import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../backend/index";

export const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:3001/api",
            // You can pass any HTTP headers you wish here
            headers() {
                return {
                    authorization: "abc"
                };
            }
        })
    ]
});
