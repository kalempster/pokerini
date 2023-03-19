import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Transition } from '@tailwindui/react'
export default function Header() {
    const [currentPath, setCurrentPath] = useState(location.pathname);
    const [activeMenu, setActiveMenu] = useState(false);
    const closeRef = useRef(null);


    useEffect(() => {
        const { pathname } = location;
        setActiveMenu(false);
        setCurrentPath(pathname);
      }, [location.pathname]);
   
  

    return (<div>
        <div className={!activeMenu ? "-translate-y-full"+"  fixed w-full h-full duration-150" : "translate-y-0" + " fixed w-full h-full duration-150"}> 
            <div className=" bg-[#181B30] menu h-full  w-full pb-20 fixed flex text-5xl flex-col  text-[#FFCD01] overflow-hidden">
                <div className="flex w-full justify-end p-14">
                    <button className="flex"  onClick={()=>setActiveMenu(!activeMenu)}>x</button>
                </div>
                <div onClick={()=>setActiveMenu(!activeMenu)} className=" h-full justify-between flex flex-col items-center px-24 py-12">
                    <Link to="">dfsdfsdfsie</Link>
                    <Link to="">cos ta fdsfs</Link>
                    <Link to="/login" >login</Link>
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
            <button className="flex p-4 lg:hidden border-none " onClick={()=>setActiveMenu(!activeMenu)}>
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
