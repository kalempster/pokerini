import {
    Outlet,
    RootRoute,
    Route,
    Router,
    useNavigate
} from "@tanstack/react-router";
import AOS from "aos";
import { useEffect, useState } from "react";
import Dialog from "../components/Dialog/Dialog";
import MobileMenu from "../components/Header/MobileMenu";
import CreateGame from "../pages/CreateGame";
import Dashboard from "../pages/Dashboard";
import ErrorPage from "../pages/ErrorPage";
import Game from "../pages/Game";
import Lobby from "../pages/Lobby";
import LogIn from "../pages/LogIn";
import Main from "../pages/Main";
import Register from "../pages/Register";
import { useJwtStore } from "../stores/jwtStore";

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

const protectedRootRoute = new Route({
    getParentRoute: () => rootRoute,
    id: "protected",
    component: () => {
        const jwtStore = useJwtStore();
        const navigate = useNavigate();
        useEffect(() => {
            if (!jwtStore.isLoggedIn()) navigate({ to: "/login" });
        }, []);

        return <Outlet />;
    }
});

const unprotectedOnlyRoute = new Route({
    getParentRoute: () => rootRoute,
    id: "unprotected",
    component: () => {
        const jwtStore = useJwtStore();
        const navigate = useNavigate();
        useEffect(() => {
            if (jwtStore.isLoggedIn()) navigate({ to: "/dashboard" });
        }, []);

        return <Outlet />;
    }
});

const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Main
});
const loginRoute = new Route({
    getParentRoute: () => unprotectedOnlyRoute,
    path: "login",
    component: LogIn
});
const registerRoute = new Route({
    getParentRoute: () => unprotectedOnlyRoute,
    path: "/sign-up",
    component: Register
});

const dashboardRoute = new Route({
    getParentRoute: () => protectedRootRoute,
    path: "/dashboard",
    component: Dashboard
});

const createGameRoute = new Route({
    getParentRoute: () => protectedRootRoute,
    path: "/create",
    component: CreateGame
});

const gameRoute = new Route({
    getParentRoute: () => protectedRootRoute,
    path: "/game",
    component: Game
});

const lobbyRoute = new Route({
    getParentRoute: () => protectedRootRoute,
    path: "/lobby",
    component: Lobby
});

const _404Route = new Route({
    getParentRoute: () => rootRoute,
    path: "*",
    component: ErrorPage
});
const routeTree = rootRoute.addChildren([
    indexRoute,
    unprotectedOnlyRoute.addChildren([loginRoute, registerRoute]),
    protectedRootRoute.addChildren([
        dashboardRoute,
        gameRoute,
        createGameRoute,
        lobbyRoute
    ]),
    _404Route
]);

export const router = new Router({ routeTree });

declare module "@tanstack/router" {
    interface Register {
        router: typeof router;
    }
}
