import { Link } from "@tanstack/react-router";

export default function Register() {
    return (
        <div className="flex h-full w-full flex-col bg-[#F3CDAD]">
            <div className="flex h-full items-center  justify-center bg-[#F3CDAD] ">
                <div className="  flex flex-col justify-center gap-14 bg-[#FFEFE1] pl-12 pr-12 pt-10 pb-10 drop-shadow-[0px_4px_100px_rgba(161,107,86,0.52)] sm:pl-24 sm:pr-24 sm:pb-20 sm:pt-20 ">
                    <div className=" flex flex-col items-center justify-center gap-11">
                        <div className="font-siemano text-4xl text-[#A16B56]">
                            Register
                        </div>
                        <div className="flex grid-flow-row flex-col gap-9 xl:flex-row">
                            <div className="flex flex-col gap-9">
                                <input
                                    type="text"
                                    placeholder="username"
                                    className="h-14 w-64 justify-center bg-[#E0A370] bg-opacity-20 pl-6 font-gotyk text-lg text-black text-opacity-25 placeholder-black placeholder-opacity-25 "
                                />
                                <input
                                    type="text"
                                    placeholder="email"
                                    className="h-14 w-64 justify-center bg-[#E0A370] bg-opacity-20 pl-6 font-gotyk text-lg text-black text-opacity-25 placeholder-black placeholder-opacity-25 "
                                />
                            </div>
                            <div className="flex flex-col gap-9">
                                <input
                                    type="text"
                                    placeholder="password"
                                    className="h-14 w-64 justify-center bg-[#E0A370]  bg-opacity-20 pl-6 font-gotyk text-lg text-black text-opacity-25 placeholder-black placeholder-opacity-25 "
                                />
                                <input
                                    type="text"
                                    placeholder="repeat password"
                                    className="h-14 w-64 justify-center bg-[#E0A370] bg-opacity-20 pl-6 font-gotyk text-lg text-black text-opacity-25 placeholder-black placeholder-opacity-25 "
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-11">
                        <div className="flex h-14 w-56 items-center justify-center bg-[#567D89] font-gotyk text-lg text-white">
                            sign up
                        </div>
                        <Link to="/login">
                            <div className="flex text-lg text-[#567D89]">
                                log in
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
