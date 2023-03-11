import { Link } from "react-router-dom";
import Header from "../components/Header/Header";

export default function LogIn() {
    return <div className="bg-[#F3CDAD] h-full w-full gap-11 flex flex-col ">
        <Header />
        <div className=" flex justify-center">
            <div className=" bg-[#FFEFE1] flex flex-col justify-center gap-12 pl-16 pr-16 pb-11 pt-9 scale-90">
                <div className=" flex flex-col justify-center items-center gap-7">
                    <div className="text-[#A16B56] font-siemano text-3xl">Login</div>
                    <input type="text" placeholder="username" className="pl-5 justify-center font-gotyk text-md w-40 h-8 text-opacity-25 text-black bg-[#E0A370] bg-opacity-20 placeholder-black placeholder-opacity-25 " />
                    <div className="flex flex-col">
                        <input type="text" placeholder="password" className=" flex pl-5 justify-center font-gotyk text-md  w-40 h-8 text-opacity-25 text-black bg-[#E0A370] bg-opacity-20 placeholder-black placeholder-opacity-25 " />
                        <div className="flex justify-end text-[9px] font-gotyk text-[#A16B56]"><Link to="">forgot password ?</Link></div>
                    </div>
                </div>
                <div className="flex flex-col gap-8 w-full justify-center items-center">
                    <div className="flex bg-[#567D89] h-9 text-[11px] font-gotyk text-white justify-center items-center w-36">log in</div>
                    <div className="flex text-[#567D89] text-[11px]">signup</div>
                </div>
            </div>
        </div>
    </div>
}