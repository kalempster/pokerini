import { RootRoute, Route, Router, Outlet } from "@tanstack/react-router";
import Header from "../components/Header/Header";
import Feeter from "../components/Feeter/Feeter";
import Main from "../pages/Main";
import LogIn from "../pages/LogIn";
import Register from "../pages/Register";
const headerRootRoute = new RootRoute({
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

const routeTree = headerRootRoute.addChildren([
    indexRoute,
    loginRoute,
    registerRoute
]);

export const router = new Router({ routeTree });

declare module "@tanstack/router" {
    interface Register {
        router: typeof router;
    }
}
