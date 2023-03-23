import { FC } from "react";

type Props = {
    children: JSX.Element[] | JSX.Element;
    /**
     * Additional classes will be added to the element
     * @example ```tsx
     * <Section className="flex justify-center"></Section>
     * ```
     */
    className?: string;
};

const Section: FC<Props> = ({ children, className }) => {
    return (
        <div className={"min-h-screen " + (className ?? "")}>{children}</div>
    );
};

export default Section;
