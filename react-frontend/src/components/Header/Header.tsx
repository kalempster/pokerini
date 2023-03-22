import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Transition } from "@tailwindui/react";
import { ReactSVG } from "react-svg";
import burger from "../../images/burger.svg"
import close from "../../images/close.svg"
export default function Header() {
    const [activeMenu, setActiveMenu] = useState(false);

    return (
        <div>
            <div
                className={
                    !activeMenu
                        ? "-translate-y-full" + "  fixed w-full h-full duration-150"
                        : "translate-y-0" + " fixed w-full h-full duration-150"
                }>
                <div className=" bg-[#181B30] menu h-full  w-full fixed flex text-5xl flex-col  text-[#FFCD01] overflow-hidden">
                    <div className="flex w-full justify-end p-14 absolute">
                        <button className="flex" onClick={() => setActiveMenu(!activeMenu)}>
                            <ReactSVG src={close} className="w-10 aspect-square fill-[#FFCD01]"/>
                        </button>
                    </div>
                    <div
                        onClick={() => setActiveMenu(!activeMenu)}
                        className=" h-full justify-between flex flex-col items-center px-24 py-24">
                        <Link to="">dfsdfsdfsie</Link>
                        <Link to="">cos ta fdsfs</Link>
                        <Link to="/login">login</Link>
                    </div>
                </div>
            </div>
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
                <button
                    className="flex p-4 lg:hidden border-none "
                    onClick={() => setActiveMenu(!activeMenu)}>
                    <ReactSVG src={burger} className="w-8 h-8 stroke-[#FFCD01]" />
                </button>
                {/* TODO profile handling and login/logout */}
            </div>
        </div>
    );
}
