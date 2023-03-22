import { FC } from "react";
import { ReactSVG } from "react-svg";
import karta from "../../images/karta.svg";

const Card: FC<{ text: string }> = ({ text }) => {
    return <ReactSVG src={karta} className="sm:w-1/3 w-full" />;
};

export default Card;
