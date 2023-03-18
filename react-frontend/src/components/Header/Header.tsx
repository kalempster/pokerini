import { useState } from "react";
import { Link } from "react-router-dom";
import { Transition } from '@tailwindui/react'
export default function Header() {
    const [activeMenu, setActiveMenu] = useState(false);

    return (<div>
        <Transition
        show={activeMenu==true}
        enter = "transition ease-in-out duration-300 "
        enterFrom="-top-full"
        enterTo="top-0"
        leave=" ease-in-out duration-300"
        leaveFrom="top-0"
        leaveTo="-top-full"
        >
            <div className="menu h-full  w-full  fixed flex text-6xl flex-col  text-[#FFCD01] ">
                <div className="flex w-full justify-end p-10">
                    <button className="flex" onClick={()=>setActiveMenu(!activeMenu)}>x</button>
                </div>
                <div className=" h-full justify-between flex flex-col items-center px-24 py-12">
                    <Link to="">dfsdfsdfsie</Link>
                    <Link to="">cos ta fdsfs</Link>
                    <Link to="/login">login</Link>
                </div>
            </div>
        </Transition>
        <div className=" bg-[#181B30] items-center flex w-full px-32 py-16 flex-row justify-center lg:justify-between  ">
            <Link to="/" className="text-5xl font-semibold">
                <span className="text-[#EF2A4F]">Poker</span>
                <span className="text-[#FFCD01] ">inee</span>
            </Link>
            <div className="hidden flex-row text-[#FFCD01] gap-16 text-2xl  lg:flex">
                <Link to="">dfsdfsdfsie</Link>
                <Link to="">cos ta fdsfs</Link>
                <Link to="/login">login</Link>
            </div>
            <button className="flex lg:hidden border-none p-1 " onClick={() => {setActiveMenu(!activeMenu); console.log("siema"+activeMenu)}}>
                <span className="Button-content">
                    <span className="Button-label">
                        <div className="HeaderMenu-toggle-bar rounded-md my-1"></div>
                        <div className="HeaderMenu-toggle-bar rounded-md my-1"></div>
                        <div className="HeaderMenu-toggle-bar rounded-md my-1"></div>
                    </span>
                </span>
            </button>
            {/* TODO profile handling and login/logout */}
        </div>
    </div>
    );
}
