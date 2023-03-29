import { Link } from "@tanstack/react-router";
import { ReactSVG } from "react-svg";
import close from "../../images/close.svg";
import ReactDOM from "react-dom";
import useMenuStore from "./useMenuStore";

const mobileMenuRoot = document.getElementById("mobile-menu");

const MobileMenu = () => {
    const menuStore = useMenuStore();

    if (!mobileMenuRoot) throw new Error("Unable to find mobile menu root");

    return ReactDOM.createPortal(
        <div
            className={
                !menuStore.active
                    ? "fixed z-10 h-[100lvh] w-[100lvw] -translate-y-full duration-700 ease-in-out"
                    : "fixed z-10 h-[100lvh] w-[100lvw] translate-y-0 duration-700 ease-in-out"
            }>
            <div className="absolute z-20 flex h-full w-full flex-col overflow-hidden bg-background  text-5xl text-primary">
                <div className="absolute top-0 right-0 p-7">
                    <button
                        className="flex"
                        onClick={() => menuStore.setActive(!menuStore.active)}>
                        <ReactSVG
                            src={close}
                            className="aspect-square w-10 fill-primary"
                        />
                    </button>
                </div>
                <div
                    onClick={() => menuStore.setActive(!menuStore.active)}
                    className=" flex h-full flex-col items-center justify-between px-24 py-24 text-2xl">
                    <Link to="">dfsdfsdfsie</Link>
                    <Link to="">cos ta fdsfs</Link>
                    <Link to="/login">login</Link>
                </div>
            </div>
        </div>,
        mobileMenuRoot
    );
};

export default MobileMenu;
