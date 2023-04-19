import { Link } from "@tanstack/react-router";
import poker from "../images/poker.png";
import {registerFormSchema} from "../../shared-schemas/registerFormSchema";
import {FormEvent,useEffect,useState} from 'react'
export default function Register() {
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
                    <div className="flex w-full flex-col items-center justify-center gap-10 lg:w-3/4 xl:w-2/3">
                        <div className="text-6xl text-primary">Sign Up</div>
                        <div className="flex w-full flex-col gap-5 text-font">
                            <input
                                type="text"
                                placeholder="Username"
                                className="flex items-center justify-center rounded-md bg-twojstary px-3 py-2  pt-3 font-thin shadow-2xl outline-none"
                            />
                            <input
                                type="email"
                                placeholder="E-mail"
                                className="flex items-center justify-center rounded-md bg-twojstary px-3 py-2  pt-3 font-thin shadow-2xl outline-none"
                            />
                            <div className="flex flex-row gap-5">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="flex w-full items-center rounded-md bg-twojstary px-3 py-2 pt-3  align-bottom font-thin shadow-2xl outline-none"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    className="flex w-full items-center rounded-md bg-twojstary px-3 py-2 pt-3  align-bottom font-thin shadow-2xl outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex w-full flex-col items-center justify-center gap-2">
                            <button
                                role="form"
                                className="w-fit rounded-md bg-secondary py-2 px-20 text-2xl text-primary lg:w-full xl:px-20">
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
                    </div>
                </div>
            </div>
            <div className="hidden min-h-full w-3/5 bg-background md:flex">
                <img src={poker} className="min-w-[995px]" alt="" />
            </div>
        </div>
    );
}
