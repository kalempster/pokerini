import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { gameCodeSchema } from "../../shared-schemas/gameCodeSchema";
import Section from "../components/Section/Section";

const Dashboard = () => {
    const [code, setCode] = useState("");
    const [codeValid, setCodeValid] = useState(false);
    const [lastCode, setLastCode] = useState("");
    const validateCode = () => {
        return gameCodeSchema.safeParse(code).success;
    };

    useEffect(() => {
        if (validateCode()) setCodeValid(true); // TODO: JOIN GAME
        else if (codeValid) setCodeValid(false);

        setLastCode(code);
        if (lastCode.length < code.length && code.length == 4) {
            setCode(code.concat("-"));
        }
    }, [code]);

    return (
        <div className="h-[100lvh] w-[100lvw]">
            <div className=" absolute z-0 flex h-[calc(var(--header-height)*1.5)] px-5 md:px-20 w-full flex-row items-center justify-between bg-background">
                <Link to="/" className="text-5xl font-semibold">
                    <span className="text-secondary">Poker</span>
                    <span className="text-primary ">inee</span>
                </Link>
                <div className="flex text-xl text-primary whitespace-pre-wrap">
                    <div>1000 </div>
                    <div>kalempster</div>
                </div>
            </div>
            <Section
                className="flex flex-col gap-5 items-center justify-center"
                isFirst
                isSingle>
                <div className="text-3xl md:text-6xl font-semibold text-primary flex justify-center flex-col items-center gap-5">
                    <div>Join a game</div>
                    <div>
                        <input
                            onChange={(e) =>
                                setCode(e.target.value.toUpperCase())
                            }
                            value={code}
                            id="code"
                            type="code"
                            placeholder="ABCD-EFGH"
                            className={`flex uppercase items-center justify-center rounded-md  px-3 py-2  shadow-2xl outline-none ${codeValid
                                    ? "text-primary bg-secondary"
                                    : "text-font bg-twojstary"
                                }`}
                        />
                        <label htmlFor="code" className="text-red-400"></label>
                    </div>
                </div>
                <div className="text-secondary text-xl">or</div>
                <button className=" rounded-md bg-secondary px-20 py-5 text-2xl md:text-5xl font-bold text-primary xl:px-20">
                    Create a game
                </button>
            </Section>
        </div>
    );
};

export default Dashboard;
