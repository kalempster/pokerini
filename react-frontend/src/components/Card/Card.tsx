import { FC } from "react";
import { ReactSVG } from "react-svg";
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

    /**
     * The icon that will be displayed above the title (.svg)
     * @example
     * ```tsx
     * import Icon from "./icon.svg";
     * <Card icon={Icon} />
     * ```
     */
    icon: string;

    /**
     * Styles that will be applied to the svg
     * @example
     * ```tsx
     * <Card className="fill-orange-700" />
     * ```
     */
    className: string;
};

const Card: FC<Props> = ({ text, title, icon, className }) => {
    return (
        <div className="sm:w-1/3 w-full text-white bg-[#EF2A4F] p-6 rounded-xl shadow-2xl shadow-black flex flex-col gap-2 hover:-translate-y-3 transition-transform relative">
            <div className="absolute left-0 top-0 p-2">
                <ReactSVG
                    src={icon}
                    className={`w-8 aspect-square ${className}`}
                />
            </div>
            <div className="text-3xl lg:text-4xl text-center font-semibold">
                {title}
            </div>
            <div className="text-lg text-justify [text-align-last:center] ">
                {text}
            </div>
        </div>
    );
};

export default Card;
