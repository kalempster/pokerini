import { Link } from "react-router-dom";
export default function Header() {
    return (
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
            <button className="flex lg:hidden border-none p-1 ">
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
    );
}
