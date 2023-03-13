import { FC } from "react";
import { ReactSVG } from "react-svg";

const Card: FC<{ title: string; text: string; icon: string; className?: string }> = ({
    title,
    text,
    icon,
    className,
}) => {
    return (
        <div className="flex items-center flex-col w-full xl:w-1/3 gap-1 justify-center p-2 ">
            <div className="flex flex-col justify-center items-center gap-5">
                <ReactSVG src={icon} className={`w-12 h-12 ${className} align-middle `} />
                <div className="text-4xl text-orange-600 text-center whitespace-normal lg:whitespace-nowrap">
                    {title}
                </div>
            </div>
            <div className="text-justify [text-align-last:_center]">{text}</div>
        </div>
    );
};

export default Card;
