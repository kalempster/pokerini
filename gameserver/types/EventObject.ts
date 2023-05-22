import { Socket } from "socket.io";
import { ZodTypeAny, z } from "zod";

export type EventObject<T = void> = {
    name: string;
} & (T extends ZodTypeAny
    ? {
          inputSchema: T;
          callback(input: {
              data: z.infer<T>;
              connection: Socket;
          }): object | Promise<object> | void | Promise<void>;
      }
    : {
          inputSchema?: T;
          callback(input: {
              connection: Socket;
          }): object | Promise<object> | void | Promise<void>;
      });
