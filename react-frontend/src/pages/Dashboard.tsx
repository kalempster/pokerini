import { useMask } from "@react-input/mask";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { gameCodeSchema } from "../../shared-schemas/gameCodeSchema";
import Section from "../components/Section/Section";
import { useJwtStore } from "../stores/jwtStore";
import Header from "../components/Header/Header";
const Dashboard = () => {
    const jwtStore = useJwtStore();

    const navigate = useNavigate();

    const codeInputRef = useMask({
        mask: "____-____",
        replacement: { _: /\w/ },
        showMask: true
    });

    const [code, setCode] = useState("");
    const [codeValid, setCodeValid] = useState(false);

    const validateCode = (code: string) => {
        return gameCodeSchema.safeParse(code).success;
    };

    useEffect(() => {
        if (!jwtStore.isLoggedIn()) navigate({ to: "/login" });
    }, []);

    useEffect(() => {
        if (validateCode(code)) setCodeValid(true); // TODO: JOIN GAME
        else if (codeValid) setCodeValid(false);
    }, [code]);

    return (
        <div className="h-[100lvh]">
            <Header />
            <Section className="flex flex-col items-center justify-center gap-5 pt-[calc(var(--header-height)*1.5)] tall:pt-0">
                <div className="flex flex-col items-center justify-center gap-5 text-3xl font-semibold text-primary md:text-6xl">
                    <div>Join a game</div>
                    <div>
                        <input
                            onChange={(e) =>
                                setCode(e.target.value.toUpperCase())
                            }
                            ref={codeInputRef}
                            id="code"
                            type="code"
                            placeholder="ABCD-EFGH"
                            className={`flex items-center justify-center rounded-md px-3 py-2 text-center font-mono  uppercase shadow-2xl  outline-none disabled:opacity-60 ${
                                codeValid
                                    ? "bg-secondary text-primary"
                                    : "bg-twojstary text-font"
                            }`}
                        />
                        <label htmlFor="code" className="text-red-400"></label>
                    </div>
                </div>
                <div className="text-xl text-secondary">or</div>
                <Link
                    to="/create"
                    className=" rounded-md bg-secondary px-20 py-5 text-2xl font-bold text-primary md:text-5xl xl:px-20">
                    Create a game
                </Link>
            </Section>
        </div>
    );
};

export default Dashboard;
