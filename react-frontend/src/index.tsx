import { RouterProvider } from "@tanstack/react-router";
import "aos/dist/aos.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { router } from "./utils/router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
        {/* piotrus to pajac (bilicki zastosował duszenie) */}
        {/* wale wam stare - piotr */}
    </React.StrictMode>
);
