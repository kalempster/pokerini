import { Link } from "@tanstack/react-router";
import Section from "../components/Section/Section";

export default function LogIn() {
    return (
        <div className="flex h-[100lvh] items-center justify-center">
            <div className="flex h-full w-2/5 flex-col px-14">
                <div className=" absolute z-0 flex h-[var(--header-height)] flex-row items-end justify-between bg-background">
                    <Link
                        to="/"
                        className="text-5xl font-semibold"
                        data-aos="fade-down">
                        <span className="text-secondary">Poker</span>
                        <span className="text-primary ">inee</span>
                    </Link>
                </div>
                <div className="h-full flex justify-center items-center text-white">
                    tak tu jest login
                </div>
            </div>
            <div className="min-h-full w-3/5 bg-secondary"></div>
        </div>
    );
}
