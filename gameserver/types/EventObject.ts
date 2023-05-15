import { Socket } from "socket.io";
import { ZodType, z } from "zod";

type ZodInferred<T extends ZodType<any, any, any>> = z.infer<T>;

export type EventObject<T = void> = {
    name: string;
} & (T extends ZodType<any, any, any>
    ? {
          inputSchema: T;
          callback(input: {
              data: ZodInferred<T>;
              connection: Socket;
          }): object | Promise<object> | void | Promise<void>;
      }
    : {
          inputSchema?: T;
          callback(input: {
              connection: Socket;
          }): object | Promise<object> | void | Promise<void>;
      });
