import { FC } from "react";

const Section : FC<{children?: JSX.Element[] | JSX.Element, className?: string}> = (props) => {
    return <div className={"h-screen " + props.className}>
        {props.children}
    </div>;
};

export default Section;