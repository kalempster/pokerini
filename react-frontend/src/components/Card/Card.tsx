import { FC } from "react";
import { ReactSVG } from "react-svg";
type Props = {
    /**
     * The title that will be displayed in the card
     * @example
     * ```tsx
     * <Card title="Example text"/>
     * ```
     */
    title: string;
    /**
     * The text that will be displayed in the card
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
    className?: string;
};

const Card: FC<Props> = ({
    text,
    title,
    icon,
    className = "fill-white",
    ...rest
}) => {
    return (
        <div
            {...rest}
            className="flex w-full flex-col gap-2 rounded-xl px-5 bg-secondary p-6 text-white shadow-2xl shadow-backgroundshadow selection:bg-primary selection:text-white lg:w-1/3">
            <div className="flex flex-col items-center justify-center gap-2">
                <ReactSVG
                    src={icon}
                    className={`aspect-square w-12 ${className}`}
                />
                <div className="text-center text-3xl font-semibold lg:text-4xl">
                    {title}
                </div>
            </div>

            <div className="text-justify text-lg [text-align-last:center] px-12">
                {text}
            </div>
        </div>
    );
};

export default Card;
