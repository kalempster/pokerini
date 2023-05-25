import { ZodTypeAny } from "zod";
import { LobbyType } from "../objects/Lobby";
import { EventObject } from "../types/EventObject";
import { client } from "./client";

export const lobbies = new Map<string, LobbyType>();

export const players = new Map<
    string,
    Awaited<ReturnType<typeof client.gameserver.isUserAuthed.query>>
>();
export const events = new Map<string, EventObject<ZodTypeAny> | EventObject>();
