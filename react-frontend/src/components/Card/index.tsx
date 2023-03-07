import { FC } from "react";
import { ReactSVG } from "react-svg";
const Card : FC<{title: string, text: string, icon: string, className?: string}> = ({title, text, icon, className}) => {
    return (
        <div className="flex items-center flex-col w-1/3 gap-2 justify-center p-2 ">
            <ReactSVG src={icon} className={`w-12 aspect-square ${className}`} />
            <div className="text-4xl text-orange-600 text-center">{title}</div>
            <div className="text-justify [text-align-last:_center]">{text}</div>
        </div>
    )
}


export default Card;