import { Link } from "react-router-dom";
export default function Header() {
    return (
        <div className=" bg-[#181B30] items-center flex w-full px-32 py-16 flex-row justify-between ">
            <Link to="/" className="text-5xl font-semibold">
                <span className="text-[#EF2A4F]">Poker</span>
                <span className="text-[#FFCD01] ">inee</span>
            </Link>
            <div className="flex flex-row text-[#FFCD01] gap-16 text-2xl ">
                <Link to="">dfsdfsdfsie</Link>
                <Link to="">cos ta fdsfs</Link>
                <Link to="/login">login</Link>
            </div>
            {/* TODO profile handling and login/logout */}
        </div>
    );
}
