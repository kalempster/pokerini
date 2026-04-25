import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../backend/index";

export const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:3001/api",
            // You can pass any HTTP headers you wish here
            headers() {
                return {
                    authorization: process.env.AUTH ?? "ee70ee94366c7f2a9e156e59d1a44d59743e377b9bb049b5f855cf24bc48d7fc"
                };
            }
        })
    ]
});
