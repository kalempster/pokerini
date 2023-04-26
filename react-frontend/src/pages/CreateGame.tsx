import { Link } from "@tanstack/react-router";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
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
                    <div className="w-full h-10">
                        <Slider
                            min={2}
                            step={1}
                            max={5}
                            dots
                            marks={{ 2: 2, 3: 3, 4: 4, 5: 5 }}
                            railStyle={{ backgroundColor: "#30365C" }}
                            activeDotStyle={{
                                borderColor: "#FFCD01",
                                backgroundColor: "#FFCD01"
                            }}
                            handleStyle={{
                                borderColor: "#FFCD01",
                                backgroundColor: "#FFCD01",
                                boxShadow: "none"
                            }}
                            dotStyle={{
                                borderColor: "#30365C",
                                backgroundColor: "#30365C"
                            }}
                            trackStyle={{
                                backgroundColor: "#EF2A4F"
                            }}
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default CreateGame;
