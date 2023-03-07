import { FC } from "react";

const Card : FC<{title: string, text: string, icon: string}> = ({title, text, icon}) => {
    return (
        <div className="flex justify-center items-center flex-col w-1/3 text-center">
            <div className="text-3xl">{title}</div>
            <div>{text}</div>


        </div>
    )
}


export default Card;