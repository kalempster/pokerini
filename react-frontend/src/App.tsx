import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LogIn from "./pages/LogIn";
import Main from "./pages/Main";
import Register from "./pages/Register";
function App() {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<LogIn/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
        </Routes>
    );
}

export default App;
