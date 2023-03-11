import Header from "../components/Header/Header"
import { Link } from "react-router-dom"

export default function Register() {
    return (
        <div className="bg-[#F3CDAD] h-full w-full flex flex-col">
            <Header />
            <div className="bg-[#F3CDAD] flex h-full  justify-center items-center ">
                <div className="  bg-[#FFEFE1] flex flex-col justify-center gap-14 sm:pl-24 sm:pr-24 sm:pb-20 sm:pt-20 pl-12 pr-12 pt-10 pb-10  ">
                    <div className=" flex flex-col justify-center items-center gap-11">
                        <div className="text-[#A16B56] font-siemano text-4xl">Register</div>
                        <div className="flex flex-col xl:flex-row gap-9 grid-flow-row" >
                            <div className="flex flex-col gap-9">
                                <input type="text" placeholder="username" className="pl-6 justify-center font-gotyk text-lg w-64 h-14 text-opacity-25 text-black bg-[#E0A370] bg-opacity-20 placeholder-black placeholder-opacity-25 " />
                                <input type="text" placeholder="email" className="pl-6 justify-center font-gotyk text-lg w-64 h-14 text-opacity-25 text-black bg-[#E0A370] bg-opacity-20 placeholder-black placeholder-opacity-25 " />
                            </div>
                            <div className="flex flex-col gap-9">
                                <input type="text" placeholder="password" className="pl-6 justify-center font-gotyk text-lg  w-64 h-14 text-opacity-25 text-black bg-[#E0A370] bg-opacity-20 placeholder-black placeholder-opacity-25 " />
                                <input type="text" placeholder="repeat password" className="pl-6 justify-center font-gotyk text-lg w-64 h-14 text-opacity-25 text-black bg-[#E0A370] bg-opacity-20 placeholder-black placeholder-opacity-25 " />
                            </div>


                        </div>

                    </div>
                    <div className="flex flex-col gap-11 w-full justify-center items-center">
                        <div className="flex bg-[#567D89] h-14 text-lg font-gotyk text-white justify-center items-center w-56">sign up</div>
                        <div className="flex text-[#567D89] text-lg">log in</div>
                    </div>
                </div>
            </div>
        </div>
    )
}