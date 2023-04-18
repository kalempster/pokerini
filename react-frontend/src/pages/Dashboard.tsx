import { Link } from "@tanstack/react-router";
import Section from "../components/Section/Section";

const Dashboard = () => {
    return (
        <div className="h-[100lvh] w-[100lvw]">
            <div className=" absolute z-0 flex h-[calc(var(--header-height)*1.5)] px-20 w-full flex-row items-center justify-between bg-background">
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
                className="flex items-center justify-center"
                isFirst
                isSingle>
                <div className="text-6xl font-semibold text-primary">
                    Join a game
                </div>
            </Section>
        </div>
    );
};

export default Dashboard;
