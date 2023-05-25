import { TRPCClientError } from "@trpc/client";
import { z } from "zod";
import { useJwtStore } from "../stores/jwtStore";
import { trpc } from "../utils/trpc";

export class RefreshError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

export const useRefreshQueryOrMutation = () => {
    const jwtStore = useJwtStore();

    const { mutateAsync } = trpc.auth.regenerateAccessToken.useMutation();
    // Generic magic
    const query = async <
        T extends () => Promise<any>,
        K extends Awaited<ReturnType<T>>
    >(
        getQuery: T
    ) => {
        let data: K;
        try {
            data = await getQuery(); // Try to process original request
        } catch (error) {
            if (!(error instanceof TRPCClientError)) throw error; // If the error is not thrown by trpc, pass the error along

            const parsed = z
                .object({ httpStatus: z.number() })
                .safeParse(error.data);

            if (!parsed.success) throw error;

            if (parsed.data.httpStatus != 401) throw error; // If the error code is not unauthorized (the access token is valid)
            // then there must've been some other error that the consumer probably wants to handle, pass it along

            const success = await refreshAccessToken(); // Regenerate token
            if (!success) throw new RefreshError(); // If the refreshing has failed throw custom error that the consumer can handle
            data = await getQuery(); // Refetch original request
        }
        return data; // Return the data
    };

    const refreshAccessToken = async () => {
        try {
            jwtStore.setAccessToken(
                (await mutateAsync({ refreshToken: jwtStore.refreshToken }))
                    .ACCESS_TOKEN
            ); // Regenerate token and set it in our global store
            return true; // Success
        } catch (error) {
            if (error instanceof TRPCClientError)
                if (error.data.httpStatus == 401) return false; // Unauthorized, our refresh token got rejected, return false to indicate that
            // refreshing has failed
        }
    };

    return query;
};
