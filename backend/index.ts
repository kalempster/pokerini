import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { createContext, t } from "./utils/trpc";

import { authRouter } from "./routers/auth";
import { gameServerRouter } from "./routers/gameserver";

const app = express();

export const appRouter = t.router({
    auth: authRouter,
    gameserver: gameServerRouter
});

export type AppRouter = typeof appRouter;

app.use(cors({ origin: "*" }));

app.use(
    "/api",
    createExpressMiddleware({
        router: appRouter,
        createContext
    })
);

app.listen(3001, () => console.log("listening"));
