import {FC} from "react"
type ActionsProps = {
    children: React.ReactNode;
    /**
     * Classes that will be added to the default styles
     */
    className?: string;
};
const Actions: FC<ActionsProps> = ({ children, className }) => {
    return (
        <div className={`flex w-full justify-end text-white ${className}`}>
            {children}
        </div>
    );
};
export default Actions;
