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

    const query = async <
        T extends () => Promise<any>,
        K extends Awaited<ReturnType<T>>
    >(
        getQuery: T
    ) => {
        let data: K;
        try {
            data = await getQuery();
        } catch (error) {
            if (!(error instanceof TRPCClientError)) throw error;

            const parsed = z
                .object({ httpStatus: z.number() })
                .safeParse(error.data);

            if (!parsed.success) throw error;

            if (parsed.data.httpStatus != 401) throw error;

            const success = await refreshAccessToken();
            if (!success) throw new RefreshError();
            data = await getQuery();
        }
        return data;
    };

    const refreshAccessToken = async () => {
        try {
            jwtStore.setAccessToken(
                (await mutateAsync({ refreshToken: jwtStore.refreshToken }))
                    .ACCESS_TOKEN
            );
            return true;
        } catch (error) {
            if (error instanceof TRPCClientError) {
                if (error.data.httpStatus == 401) return false;
            }
        }
    };

    return query;
};
