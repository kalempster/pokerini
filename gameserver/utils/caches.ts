import { ZodType, ZodTypeAny } from "zod";
import { Lobby } from "../objects/Lobby";
import { EventObject } from "../types/EventObject";
import { client } from "./client";

export const lobbies = new Map<string, Lobby>();

export const players = new Map<
    string,
    Awaited<ReturnType<typeof client.gameserver.isUserAuthed.query>>
>();
export const events = new Map<
    string,
    EventObject<ZodTypeAny> | EventObject
>();
