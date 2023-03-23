import { useState } from "react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import burger from "../../images/burger.svg";
import close from "../../images/close.svg";
export default function Header() {
    const [activeMenu, setActiveMenu] = useState(false);

    return (
        <div>
            <div
                className={
                    !activeMenu
                        ? "-translate-y-full" +
                          " fixed w-screen h-screen duration-500 ease-in-out"
                        : "translate-y-0" +
                          " fixed w-screen h-screen duration-500 ease-in-out"
                }>
                <div className=" bg-[#181B30] menu h-full  w-full z-20 fixed flex text-5xl flex-col  text-[#FFCD01] overflow-hidden">
                    <div className="absolute top-0 right-0 p-7">
                        <button
                            className="flex"
                            onClick={() => setActiveMenu(!activeMenu)}>
                            <ReactSVG
                                src={close}
                                className="w-10 aspect-square fill-[#FFCD01]"
                            />
                        </button>
                    </div>
                    <div
                        onClick={() => setActiveMenu(!activeMenu)}
                        className=" h-full justify-between flex flex-col text-2xl items-center px-24 py-24">
                        <Link to="">dfsdfsdfsie</Link>
                        <Link to="">cos ta fdsfs</Link>
                        <Link to="/login">login</Link>
                    </div>
                </div>
            </div>
            <div className=" bg-[#181B30] items-center flex w-full px-4 md:px-32 h-[var(--header-height)] flex-row justify-between  absolute">
                <Link to="/" className="text-5xl font-semibold">
                    <span className="text-[#EF2A4F]">Poker</span>
                    <span className="text-[#FFCD01] ">inee</span>
                </Link>
                <div className="hidden flex-row text-[#FFCD01] gap-16 md:text-2xl  lg:flex">
                    <Link to="">dfsdfsdfsie</Link>
                    <Link to="">cos ta fdsfs</Link>
                    <Link to="/login">login</Link>
                </div>
                <button
                    className="flex lg:hidden border-none "
                    onClick={() => setActiveMenu(!activeMenu)}>
                    <ReactSVG
                        src={burger}
                        className="w-10 aspect-square stroke-[#FFCD01]"
                    />
                </button>
                {/* TODO profile handling and login/logout */}
            </div>
        </div>
    );
}
