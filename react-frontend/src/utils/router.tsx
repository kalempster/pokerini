import { Outlet, RootRoute, Route, Router } from "@tanstack/react-router";
import AOS from "aos";
import { useEffect, useState } from "react";
import Dialog from "../components/Dialog/Dialog";
import Feeter from "../components/Feeter/Feeter";
import Header from "../components/Header/Header";
import MobileMenu from "../components/Header/MobileMenu";
import Dashboard from "../pages/Dashboard";
import ErrorPage from "../pages/ErrorPage";
import Game from "../pages/Game";
import LogIn from "../pages/LogIn";
import Main from "../pages/Main";
import Register from "../pages/Register";

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
                                window.location.href =
                                    "https://www.amazon.com/McLovin-Fun-Fake-License-Model/dp/B00W98CY3C";
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

const gameRoute = new Route({
    getParentRoute: () => headlessRootRoute,
    path: "/game",
    component: Game
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
    headlessRootRoute.addChildren([
        dashboardRoute,
        loginRoute,
        registerRoute,
        gameRoute
    ]),
    errorRootRoute.addChildren([errorRoute])
]);

export const router = new Router({ routeTree });

declare module "@tanstack/router" {
    interface Register {
        router: typeof router;
    }
}
