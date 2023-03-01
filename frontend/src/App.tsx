import type { VoidComponent } from "solid-js";
import { useQueryClient } from "@tanstack/solid-query";
import { Route, Router, Routes } from "@solidjs/router";
import Main from "./components/Main";

const App: VoidComponent = () => {
    return (
        <Routes>
            <Route path={"/"} component={Main} />
        </Routes>
    );
};

export default App;
