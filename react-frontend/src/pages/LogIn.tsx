import { Link } from "@tanstack/react-router";

export default function LogIn() {
    return (
        <div className="flex h-[100lvh] items-center justify-center">
            <div className="flex min-h-[100lvh] w-2/5 flex-col px-14">
                <div className=" absolute z-0 flex h-[var(--header-height)] flex-row items-end justify-between bg-background">
                    <Link to="/" className="text-5xl font-semibold">
                        <span className="text-secondary">Poker</span>
                        <span className="text-primary ">inee</span>
                    </Link>
                </div>
                <div className="flex min-h-[100lvh] items-center justify-center pt-[var(--header-height)] text-white tall:pt-0 ">
                    <div className="flex w-1/2 flex-col items-center justify-center gap-10 ">
                        <div className="text-6xl text-primary">Log In</div>
                        <div className="flex w-full flex-col gap-5">
                            <input
                                type="text"
                                placeholder="Username"
                                className="flex items-center justify-center rounded-md px-3 py-2 text-black"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="flex items-center justify-center rounded-md px-3 py-2 text-black"
                            />
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                            <button className="rounded-md bg-secondary px-20 py-2 text-2xl text-primary">
                                Login
                            </button>
                            <div className="flex justify-center whitespace-pre-wrap">
                                <Link to="/register" className="text-primary">
                                    Sign up
                                </Link>
                                <span> instead</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="min-h-full w-3/5 bg-secondary"></div>
        </div>
    );
}
