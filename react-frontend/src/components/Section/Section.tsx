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
     * Is it the first section after navbar
     * @example ```tsx
     * <Section isFirst></Section>
     * ```
     */
    isFirst?: boolean;
    /**
     * Is it the only section on the page
     * @example ```tsx
     * <Section isSingle></Section>
     * ```
     */

    isSingle?: boolean;
};

const Section: FC<Props> = ({
    children,
    className,
    isFirst = false,
    isSingle = false
}) => {
    return (
        <div
            className={
                (isFirst ? "pt-[var(--header-height)] tall:pt-0 " : "") +
                (isSingle
                    ? "min-h-[calc(100vh-var(--small-footer-height))] pt-[var(--header-height)] md:min-h-[calc(100vh-var(--big-footer-height))] "
                    : "min-h-screen ") +
                (className ?? "")
            }>
            {children}
        </div>
    );
};

export default Section;
