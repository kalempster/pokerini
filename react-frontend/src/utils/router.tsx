import { RootRoute, Route, Router, Outlet } from "@tanstack/react-router";
import Header from "../components/Header/Header";
import Feeter from "../components/Feeter/Feeter";
import Main from "../pages/Main";
import LogIn from "../pages/LogIn";
import Register from "../pages/Register";
import { useEffect, useState } from "react";
import AOS from "aos";
import Dialog from "../components/Dialog/Dialog";
import Dashboard from "../pages/Dashboard";
import ErrorPage from "../pages/ErrorPage";
import MobileMenu from "../components/Header/MobileMenu";

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
                <MobileMenu />
                <Dialog visible={isAdultDialogVisible}>
                    <Dialog.Title>Are you at least 18 years old?</Dialog.Title>
                    <Dialog.Actions className="gap-5">
                        <button
                            className="rounded-lg bg-secondary bg-opacity-0 px-2 transition-colors hover:bg-opacity-100"
                            onClick={() => {
                                window.location.href = "https://www.amazon.com/McLovin-Fun-Fake-License-Model/dp/B00W98CY3C";
                            }}>
                            No
                        </button>
                        <button
                            className="rounded-lg bg-secondary bg-opacity-0 px-2 transition-colors hover:bg-opacity-100"
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

const headlessRootRoute = new Route({
    id: "headless",
    getParentRoute: () => rootRoute,
    component: () => {
        return <Outlet />;
    }
});

const indexRoute = new Route({
    getParentRoute: () => headerRootRoute,
    path: "/",
    component: Main
});
const loginRoute = new Route({
    getParentRoute: () => headlessRootRoute,
    path: "/login",
    component: LogIn
});
const registerRoute = new Route({
    getParentRoute: () => headlessRootRoute,
    path: "/register",
    component: Register
});

const dashboardRoute = new Route({
    getParentRoute: () => headlessRootRoute,
    path: "/dashboard",
    component: Dashboard
});

const errorRootRoute = new Route({
    id: "error",
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

const errorRoute = new Route({
    getParentRoute: () => errorRootRoute,
    path: "/*",
    component: ErrorPage
});
const routeTree = rootRoute.addChildren([
    headerRootRoute.addChildren([indexRoute]),
    headlessRootRoute.addChildren([dashboardRoute, loginRoute, registerRoute]),
    errorRootRoute.addChildren([errorRoute])
]);

export const router = new Router({ routeTree });

declare module "@tanstack/router" {
    interface Register {
        router: typeof router;
    }
}
