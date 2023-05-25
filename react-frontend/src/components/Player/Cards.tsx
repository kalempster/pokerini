import { FC } from "react";

const Cards: FC<{ children?: JSX.Element[] | JSX.Element }> = ({
    children
}) => {
    return <div className="flex gap-2">{children}</div>;
};

export default Cards;
