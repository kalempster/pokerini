import { FC } from "react";

const Section : FC<{children?: JSX.Element[] | JSX.Element, className?: string}> = (props) => {
    return <div className={"min-h-screen " + (props.className ? props.className : "")}>
        {props.children}
    </div>;
};

export default Section;