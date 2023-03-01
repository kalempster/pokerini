/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import App from "./App";
import { trpc, client, queryClient } from "./utils/trpc";
import { Router } from "@solidjs/router";

render(
    () => (
        <Router>
            <trpc.Provider client={client} queryClient={queryClient}>
                <App />
            </trpc.Provider>
        </Router>
    ),
    document.getElementById("root") as HTMLElement
);
