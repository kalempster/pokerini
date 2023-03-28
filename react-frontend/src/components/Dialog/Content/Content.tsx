import {FC} from "react"

type ContentProps = {
    children: React.ReactNode;
    /**
     * Classes that will override the default styles.
     */
    className?: string;
};

const Content: FC<ContentProps> = ({ children, className }) => {
    return (
        <div className={className ? className : "text-white"}>{children}</div>
    );
};
export default Content;