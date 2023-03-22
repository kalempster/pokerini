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
    /**
     * If the section is the first one in the page (is under header)
     * @default false
     */
    isStarting?: boolean;
};

const Section: FC<Props> = ({children, className, isStarting = false}) => {
    return (
        <div
            className={
                (isStarting ? "min-h-[calc(100vh-var(--header-height))] " : "min-h-screen ") +
                (className ?? "")
            }>
            {children}
        </div>
    );
};

export default Section;
