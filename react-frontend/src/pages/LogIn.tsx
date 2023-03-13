import { Link } from "react-router-dom";
import Header from "../components/Header/Header";

export default function LogIn() {
    return <div className="bg-[#F3CDAD] h-full w-full flex flex-col">
        <Header />
        <div className="bg-[#F3CDAD] flex h-full  justify-center items-center ">
            <div className="  bg-[#FFEFE1] flex flex-col justify-center gap-14 sm:pl-24 sm:pr-24 sm:pb-20 sm:pt-20 pl-12 pr-12 pt-10 pb-10 drop-shadow-[0px_4px_100px_rgba(161,107,86,0.52)] ">
                <div className=" flex flex-col justify-center items-center gap-11">
                    <div className="text-[#A16B56] font-siemano text-4xl">Log in</div>
                    <input type="text" placeholder="username" className="pl-6 justify-center font-gotyk text-lg w-64 h-14 text-opacity-25 text-black bg-[#E0A370] bg-opacity-20 placeholder-black placeholder-opacity-25 " />
                    <div className="flex flex-col">
                        <input type="text" placeholder="password" className="pl-6 justify-center font-gotyk text-lg  w-64 h-14 text-opacity-25 text-black bg-[#E0A370] bg-opacity-20 placeholder-black placeholder-opacity-25 " />
                        <div className="flex justify-end text-xs font-gotyk text-[#A16B56]"><Link to="">forgot password ?</Link></div>
                    </div>
                </div>
                <div className="flex flex-col gap-11 w-full justify-center items-center">
                    <div className="flex bg-[#567D89] h-14 text-lg font-gotyk text-white justify-center items-center w-56">login</div>
                    <Link to="/register"><div className="flex text-[#567D89] text-lg">sign up</div></Link>
                </div>
            </div>
        </div>
    </div>
}