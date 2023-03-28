type TitleProps = {
    children: string;
    /**
     * Classes that will override the default styles.
     */
    className?: string;
};

const Title = ({ children, className }: TitleProps) => {
    return (
        <div className={className ? className : "w-full text-3xl text-white "}>
            {children}
        </div>
    );
};
export default Title;