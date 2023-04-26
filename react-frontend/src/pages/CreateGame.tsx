import { Listbox } from "@headlessui/react";
import { Link } from "@tanstack/react-router";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useEffect, useState } from "react";
import Section from "../components/Section/Section";

const bets = [100, 500, 1000, 5000, 10000];
const CreateGame = () => {
    const [selectedBet, setSelectedBet] = useState(bets[0]);
    const [players, setPlayers] = useState(2);

    useEffect(() => {
        console.log(selectedBet, players);
    }, [selectedBet, players]);

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
                <div className=" font-semibold text-primary flex justify-center flex-col items-center gap-10">
                    <div className="text-3xl md:text-6xl">Create a game</div>
                    <div className="w-full flex flex-col gap-2">
                        <div className="text-3xl">Players</div>

                        <Slider
                            onChange={(v) =>
                                typeof v == "number" ? setPlayers(v) : null
                            }
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
                        />
                    </div>
                    <div className="flex w-full flex-col justify-center gap-2">
                        <div className="text-3xl">Big blind</div>
                        <Listbox value={selectedBet} onChange={setSelectedBet}>
                            <div className="relative">
                                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-secondary py-2 pl-3 pr-10 text-left shadow-md sm:text-sm">
                                    <span className="block truncate text-primary">
                                        {selectedBet}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        v
                                    </span>
                                </Listbox.Button>

                                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-twojstary py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {bets.map((bet, betIdx) => (
                                        <Listbox.Option
                                            key={betIdx}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active
                                                        ? "bg-secondary text-primary"
                                                        : "text-white"
                                                }`
                                            }
                                            value={bet}>
                                            {({ selected }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${
                                                            selected
                                                                ? "font-medium"
                                                                : "font-normal"
                                                        }`}>
                                                        {bet}
                                                    </span>
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                    </div>
                    <button className="rounded-md bg-secondary px-20 py-2 text-2xl md:text-2xl font-bold text-primary xl:px-10">
                        Create a game
                    </button>
                </div>
            </Section>
        </div>
    );
};

export default CreateGame;
