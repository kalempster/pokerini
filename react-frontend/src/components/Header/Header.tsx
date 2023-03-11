import { Link } from "react-router-dom"
export default function Header() {
    return (<div className="h-16 bg-[#A16B56] justify-center items-center  flex w-full  text-[#F9E0CA]">
        <Link to="/"><span className="flex text-4xl font-siemano ">pokerinee</span></Link>
        {/* TODO profile handling and login/logout */}
    </div>

    )


}