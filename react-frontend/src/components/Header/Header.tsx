import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ReactSVG } from "react-svg";
import burger from "../../images/burger.svg";
import close from "../../images/close.svg";
export default function Header() {
    const [activeMenu, setActiveMenu] = useState(false);

    return (
        <>
            <div
                className={
                    !activeMenu
                        ? "fixed z-10 h-screen w-screen -translate-y-full duration-500 ease-in-out"
                        : "fixed z-10 h-screen w-screen translate-y-0 duration-500 ease-in-out"
                }>
                <div className="absolute z-20 flex h-full w-full flex-col overflow-hidden bg-background  text-5xl text-primary">
                    <div className="absolute top-0 right-0 p-7">
                        <button
                            className="flex"
                            onClick={() => setActiveMenu(!activeMenu)}>
                            <ReactSVG
                                src={close}
                                className="aspect-square w-10 fill-primary"
                            />
                        </button>
                    </div>
                    <div
                        onClick={() => setActiveMenu(!activeMenu)}
                        className=" flex h-full flex-col items-center justify-between px-24 py-24 text-2xl">
                        <Link to="">dfsdfsdfsie</Link>
                        <Link to="">cos ta fdsfs</Link>
                        <Link to="/login">login</Link>
                    </div>
                </div>
            </div>
            <div className=" absolute z-0 flex h-[var(--header-height)] w-full flex-row items-center justify-between bg-background px-4  md:px-32">
                <Link to="/" className="text-5xl font-semibold">
                    <span className="text-secondary">Poker</span>
                    <span className="text-primary ">inee</span>
                </Link>
                <div className="hidden flex-row gap-16 text-primary md:text-2xl  lg:flex">
                    <Link to="">dfsdfsdfsie</Link>
                    <Link to="">cos ta fdsfs</Link>
                    <Link to="/login">login</Link>
                </div>
                <button
                    className="flex border-none lg:hidden "
                    onClick={() => setActiveMenu(!activeMenu)}>
                    <ReactSVG
                        src={burger}
                        className="aspect-square w-10 stroke-primary"
                    />
                </button>
                {/* TODO profile handling and login/logout */}
            </div>
        </>
    );
}
