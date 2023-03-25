import { RootRoute, Route, Router, Outlet } from "@tanstack/react-router";
import Header from "../components/Header/Header";
import Feeter from "../components/Feeter/Feeter";
import Main from "../pages/Main";
import LogIn from "../pages/LogIn";
import Register from "../pages/Register";
import { useEffect, useState } from "react";
import AOS from "aos";
import Dialog from "../components/Dialog/Dialog";

const rootRoute = new RootRoute({
    component: () => {
        const [isAdultDialogVisible, setIsAdultDialogVisible] = useState(false);

        useEffect(() => {
            AOS.init({ once: true, easing: "ease-out-quad", duration: 1000 });
            (() => {
                const adult = localStorage.getItem("isAdult");

                if (!adult) {
                    localStorage.setItem("isAdult", "0");
                    setIsAdultDialogVisible(true);
                    return;
                }

                if (isNaN(parseInt(adult))) {
                    localStorage.setItem("isAdult", "0");
                    setIsAdultDialogVisible(true);
                    return;
                }

                if (!parseInt(adult)) {
                    setIsAdultDialogVisible(true);
                    return;
                }
            })();
        }, []);

        return (
            <>
                <Dialog visible={isAdultDialogVisible}>
                    <Dialog.Title>Are you at least 18 years old?</Dialog.Title>
                    <Dialog.Actions className="gap-5">
                        <button
                            onClick={() => {
                                window.location.href = "https://google.com";
                            }}>
                            No
                        </button>
                        <button
                            onClick={() => {
                                setIsAdultDialogVisible(false);
                                localStorage.setItem("isAdult", "1");
                            }}>
                            Yes
                        </button>
                    </Dialog.Actions>
                </Dialog>
                <Outlet />
            </>
        );
    }
});

const headerRootRoute = new Route({
    id: "header",
    path: "/",
    getParentRoute: () => rootRoute,
    component: () => {
        return (
            <>
                <Header />
                <Outlet />
                <Feeter />
            </>
        );
    }
});

const indexRoute = new Route({
    getParentRoute: () => headerRootRoute,
    path: "/",
    component: Main
});
const loginRoute = new Route({
    getParentRoute: () => headerRootRoute,
    path: "/login",
    component: LogIn
});
const registerRoute = new Route({
    getParentRoute: () => headerRootRoute,
    path: "/register",
    component: Register
});

const routeTree = rootRoute.addChildren([
    headerRootRoute.addChildren([indexRoute, loginRoute, registerRoute])
]);

export const router = new Router({ routeTree });

declare module "@tanstack/router" {
    interface Register {
        router: typeof router;
    }
}
