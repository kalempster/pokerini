import { FC } from "react";
import { ReactSVG } from "react-svg";
import karta from "../../images/karta.svg";

type Props = {
    /**
     * The title that will be displyed in the card
     * @example
     * ```tsx
     * <Card title="Example text"/>
     * ```
     */
    title: string;
    /**
     * The text that will be displyed in the card
     * @example
     * ```tsx
     * <Card text="Example text"/>
     * ```
     */
    text: string;
};

const Card: FC<Props> = ({ text, title }) => {
    return <div className="sm:w-1/3 z-10 w-full aspect-[185/266] card text-white">
        {/* zapytacie pewnie skad mam te procenty */}
        {/* z piatnicy no bo skad */}
        <div className="absolute  top-[12%] left-[16%] w-[68%] h-[66%] p-4 overflow-hidden">
            <div className="text-xl md:text-2xl lg:text-3xl text-center font-normal">{title}</div>
            <div className="sm:text-xs md:text-sm lg:text-base text-center font-extralight ">{text}</div>
            

        </div>
    </div>;
};

export default Card;
