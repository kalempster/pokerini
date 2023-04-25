import { Link } from "@tanstack/react-router";
import Section from "../components/Section/Section";

const CreateGame = () => {
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
            <Section className="flex flex-col gap-5 items-center justify-center pt-[calc(var(--header-height)*1.5)] tall:pt-0">
                <div className="text-3xl md:text-6xl font-semibold text-primary flex justify-center flex-col items-center gap-5">
                    <div>Create a game</div>
                </div>
            </Section>
        </div>
    );
};

export default CreateGame;
