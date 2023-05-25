import { Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { registerFormSchema } from "../../shared-schemas/registerFormSchema";
import poker from "../images/poker.png";

import { trpc } from "../utils/trpc";
import { useJwtStore } from "../stores/jwtStore";
import { TRPCClientError } from "@trpc/client";
export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [formError, setFormError] = useState<string | null>();
    const [usernameError, setUsernameError] = useState<string | null>();
    const [passwordError, setPasswordError] = useState<string | null>();
    const [emailError, setEmailError] = useState<string | null>();
    const [confirmPasswordError, setConfirmPasswordError] = useState<
        string | null
    >();
    const [systemError, setSystemError] = useState<string | null>();
    const jwtStore = useJwtStore();
    const navigate = useNavigate();
    const registerMutation = trpc.auth.register.useMutation();
    const loginMutation = trpc.auth.login.useMutation();
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSystemError(null);
        setUsernameError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);
        setEmailError(null);
        setFormError(null);

        const parsed = registerFormSchema.safeParse({
            username,
            email,
            password,
            confirmPassword
        });
        if (!parsed.success) {
            console.log(parsed.error.flatten());

            setUsernameError(
                parsed.error.flatten().fieldErrors.username
                    ? parsed.error.flatten().fieldErrors.username?.[0]
                    : undefined
            );
            setConfirmPasswordError(
                parsed.error.flatten().fieldErrors.confirmPassword
                    ? parsed.error.flatten().fieldErrors.confirmPassword?.[0]
                    : undefined
            );
            setEmailError(
                parsed.error.flatten().fieldErrors.email
                    ? parsed.error.flatten().fieldErrors.email?.[0]
                    : undefined
            );
            setPasswordError(
                parsed.error.flatten().fieldErrors.password
                    ? parsed.error.flatten().fieldErrors.password?.[0]
                    : undefined
            );
            if (
                !(
                    usernameError &&
                    emailError &&
                    passwordError &&
                    confirmPasswordError
                )
            ) {
                setFormError(
                    parsed.error.flatten().formErrors
                        ? parsed.error.flatten().formErrors?.[0]
                        : undefined
                );
                return;
            }
        }
        try {
            console.log(email);
            await registerMutation.mutateAsync({
                username,
                email,
                password,
                confirmPassword
            }); // ik ik we don't need to send the confirm password whatever
            // I was too lazy to create another zod schema so I just grabbed the one that is used for frontend verification
            const result = await loginMutation.mutateAsync({
                username,
                password
            });
            jwtStore.setAccessToken(result.ACCESS_TOKEN);
            jwtStore.setRefreshToken(result.REFRESH_TOKEN);

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
                <div className="flex min-h-[100lvh] items-center justify-center pt-[var(--header-height)] text-white tall:pt-0 ">
                    <form
                        onSubmit={onSubmit}
                        className="flex w-full flex-col items-center justify-center gap-10 lg:w-3/4 xl:w-2/3">
                        <div className="text-6xl text-primary">Sign Up</div>
                        <div className="text-red-400">
                            {systemError ? systemError : null}
                        </div>
                        <div className="flex w-full flex-col gap-5 text-font">
                            <div className="flex flex-col gap-1">
                                <input
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    type="text"
                                    placeholder="Username"
                                    className="flex items-center justify-center rounded-md bg-twojstary px-3 py-2  pt-3 font-thin shadow-2xl outline-none"
                                />
                                <span className="text-red-400">
                                    {usernameError ? usernameError : null}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="E-mail"
                                    className="flex items-center justify-center rounded-md bg-twojstary px-3 py-2  pt-3 font-thin shadow-2xl outline-none"
                                />
                                <span className="text-red-400">
                                    {emailError}
                                </span>
                            </div>
                            <div className="flex flex-row gap-5">
                                <div className="flex w-full flex-col gap-1">
                                    <input
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        type="password"
                                        placeholder="Password"
                                        className="flex w-full items-center rounded-md bg-twojstary px-3 py-2 pt-3  align-bottom font-thin shadow-2xl outline-none"
                                    />
                                    <span className="text-red-400">
                                        {passwordError ? passwordError : null}
                                    </span>
                                </div>
                                <div className="flex w-full flex-col gap-1">
                                    <input
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        type="password"
                                        placeholder="Confirm password"
                                        className="flex w-full items-center rounded-md bg-twojstary px-3 py-2 pt-3  align-bottom font-thin shadow-2xl outline-none"
                                    />
                                    <span className="text-red-400">
                                        {confirmPasswordError
                                            ? confirmPasswordError
                                            : null}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <span className="text-red-400">
                            {formError ? formError : null}
                        </span>
                        <div className="flex w-full flex-col items-center justify-center gap-2">
                            <button
                                disabled={registerMutation.isLoading}
                                role="form"
                                className="w-fit rounded-md bg-secondary px-20 py-2 text-2xl text-primary lg:w-full xl:px-20">
                                Sign up
                            </button>

                            <div className="flex justify-center whitespace-pre-wrap">
                                <Link
                                    to="/login"
                                    className="text-primary underline">
                                    Log in
                                </Link>
                                <span> instead</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="hidden min-h-full w-3/5 bg-background bg-poker md:flex"></div>
        </div>
    );
}
