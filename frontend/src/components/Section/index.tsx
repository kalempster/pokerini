import { Component, ComponentProps, JSX } from "solid-js";

const Section : Component<{children?: JSX.Element, class?: string}> = (props) => {
    return <div class={"h-full " + props.class}>
        {props.children}
    </div>;
};

export default Section;