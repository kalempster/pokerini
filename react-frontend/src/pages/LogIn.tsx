import { Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { loginFormSchema } from "../../shared-schemas/loginFormSchema";
import poker from "../images/poker.png";
export default function LogIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [usernameError, setUsernameError] = useState<string | undefined>();
    const [passwordError, setPasswordError] = useState<string | undefined>();

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setUsernameError(undefined);
        setPasswordError(undefined);

        const parsed = loginFormSchema.safeParse({ username, password });
        if (!parsed.success) {
            console.log(parsed.error.flatten());
            setUsernameError(
                parsed.error.flatten().fieldErrors.username
                    ? parsed.error.flatten().fieldErrors.username?.[0]
                    : undefined
            );
            return setPasswordError(
                parsed.error.flatten().fieldErrors.password
                    ? parsed.error.flatten().fieldErrors.password?.[0]
                    : undefined
            );
        }
        console.log(parsed.data);
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
                            <button className="w-fit rounded-md bg-secondary px-20 py-2 text-2xl text-primary lg:w-full xl:px-20">
                                Login
                            </button>
                            <div className="flex justify-center whitespace-pre-wrap">
                                <Link
                                    to="/register"
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
                <img src={poker} className="min-w-[995px]" alt="" />
            </div>
        </div>
    );
}
