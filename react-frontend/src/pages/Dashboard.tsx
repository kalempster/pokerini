import { useMask } from "@react-input/mask";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { gameCodeSchema } from "../../shared-schemas/gameCodeSchema";
import Section from "../components/Section/Section";
const Dashboard = () => {
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
        if (validateCode(code)) setCodeValid(true); // TODO: JOIN GAME
        else if (codeValid) setCodeValid(false);
    }, [code]);

    return (
        <div className="h-[100lvh]">
            <div className=" absolute z-0 flex h-[calc(var(--header-height)*1.5)] w-full flex-row items-center justify-between bg-background px-5 md:px-20">
                <Link to="/" className="text-5xl font-semibold">
                    <span className="text-secondary">Poker</span>
                    <span className="text-primary ">inee</span>
                </Link>
                <div className="flex whitespace-pre-wrap text-xl text-primary">
                    <div>1000 </div>
                    <div>kalempster</div>
                </div>
            </div>
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
                            className={`flex items-center justify-center rounded-md px-3 py-2 font-mono  uppercase shadow-2xl  outline-none disabled:opacity-60 ${
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
