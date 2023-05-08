import { Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { loginFormSchema } from "../../shared-schemas/loginFormSchema";
import poker from "../images/poker.png";
import { trpc } from "../utils/trpc";
import { useJwtStore } from "../stores/jwtStore";
import { TRPCClientError } from "@trpc/client";
import { useUserStore } from "../stores/userStore";
export default function LogIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const userStore = useUserStore();
    const navigate = useNavigate();

    const jwtStore = useJwtStore();

    const [systemError, setSystemError] = useState<string | null>();
    const [usernameError, setUsernameError] = useState<string | null>();
    const [passwordError, setPasswordError] = useState<string | null>();

    const mutation = trpc.auth.login.useMutation();

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSystemError(null);
        setUsernameError(null);
        setPasswordError(null);

        const parsed = loginFormSchema.safeParse({ username, password });
        if (!parsed.success) {
            setUsernameError(
                parsed.error.flatten().fieldErrors.username
                    ? parsed.error.flatten().fieldErrors.username?.[0]
                    : null
            );
            setPasswordError(
                parsed.error.flatten().fieldErrors.password
                    ? parsed.error.flatten().fieldErrors.password?.[0]
                    : null
            );
            return;
        }
        try {
            const result = await mutation.mutateAsync({ username, password });

            jwtStore.setAccessToken(result.ACCESS_TOKEN);
            jwtStore.setRefreshToken(result.REFRESH_TOKEN);
            userStore.setUser({
                ...result.user!,
                createdAt: new Date(result.user!.createdAt),
                updatedAt: new Date(result.user!.updatedAt)
            });
            navigate({ to: "/dashboard" });
        } catch (error) {
            if (error instanceof TRPCClientError) setSystemError(error.message);
        }
    };

    return (
        <div className="flex h-[100lvh] items-center justify-center overflow-hidden">
            <div className="flex min-h-[100lvh] w-full flex-col px-5 md:w-2/5 md:px-14">
                <div className=" absolute z-0 flex h-[var(--header-height)] flex-row items-end justify-between bg-background">
                    <Link to="/" className="text-5xl font-semibold">
                        <span className="text-secondary">Poker</span>
                        <span className="text-primary ">inee</span>
                    </Link>
                </div>
                <form
                    onSubmit={onSubmit}
                    className="flex min-h-[100lvh] items-center justify-center pt-[var(--header-height)] text-white tall:pt-0 ">
                    <div className="flex w-full flex-col items-center justify-center gap-10 lg:w-3/4 xl:w-1/2 ">
                        <div className="text-6xl text-primary">Log In</div>

                        <div className="text-red-400">
                            {systemError ? systemError : null}
                        </div>
                        <div className="flex w-full flex-col gap-5">
                            <div className="flex flex-col gap-1">
                                <input
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    type="text"
                                    placeholder="Username"
                                    className="flex w-full items-center justify-center rounded-md bg-twojstary px-3 py-2 text-font shadow-2xl outline-none"
                                />
                                <span className="text-red-400">
                                    {usernameError ? usernameError : null}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <input
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    className="flex w-full items-center justify-center rounded-md bg-twojstary px-3 py-2 text-font shadow-2xl outline-none"
                                />
                                <label
                                    htmlFor="password"
                                    className="text-red-400">
                                    {passwordError ? passwordError : null}
                                </label>
                            </div>
                        </div>
                        <div className="flex w-full flex-col items-center justify-center gap-2">
                            <button
                                disabled={mutation.isLoading}
                                className="w-fit rounded-md bg-secondary px-20 py-2 text-2xl text-primary disabled:opacity-40 lg:w-full xl:px-20">
                                Login
                            </button>
                            <div className="flex justify-center whitespace-pre-wrap">
                                <Link
                                    to="/sign-up"
                                    className="text-primary underline">
                                    Sign up
                                </Link>
                                <span> instead</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="hidden min-h-full w-3/5 bg-background md:flex">
                <img src={poker} alt="" />
            </div>
        </div>
    );
}
