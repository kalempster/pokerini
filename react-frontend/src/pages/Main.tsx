import Card from "../components/Card/Card";
import Section from "../components/Section/Section";
import Karty from "../images/karty.svg";
import { ReactSVG } from "react-svg";
import Star from "../images/shine.svg";
import PlayingCards from "../images/playing-cards.svg";
import Coin from "../images/coin.svg";

export default function Main() {
    return (
        <>
            <Section className="flex w-full items-center bg-background" isFirst>
                <div className="flex w-full justify-center px-4 md:px-28 lg:justify-between 2xl:px-72">
                    <div className="flex w-full flex-col justify-between gap-14 text-left text-primary lg:w-5/12 lg:text-left">
                        <div className=" flex flex-col gap-2 text-5xl font-bold md:text-6xl">
                            Generations worth of work Poker experience
                            <div className="text-xl font-extralight text-[#FFCD01DA]">
                                Immerse yourself into the game of Poker and feel
                                the game like you&apos;ve never have felt
                                before.
                            </div>
                        </div>

                        <a className=" flex w-full items-center justify-center rounded-[20px] bg-secondary py-6 text-3xl font-semibold text-primary ">
                            Countinue
                        </a>
                    </div>
                    <div className="hidden w-1/2 items-center lg:flex">
                        <ReactSVG src={Karty} className="w-full" />
                    </div>
                </div>
            </Section>

            <Section className="flex w-full flex-col items-center justify-center bg-background p-10">
                <div className="flex w-full flex-col  justify-center gap-10 lg:w-5/6 xl:w-9/12">
                    <div className="w-full text-6xl font-bold text-primary lg:text-8xl">
                        What do we offer?
                    </div>
                    <div className="flex  flex-col items-stretch gap-10 lg:flex-row">
                        <Card
                            title="Free forever"
                            text="Our service is provided to you free of charge, forever. Enjoy the game of poker with your friends without having to pay a cent for it. Just create an acount and start playing!"
                            icon={Coin}
                        />
                        <Card
                            title="Superb immersion"
                            text="With our game you will feel like you're really sitting right there, at the table playing poker. Smoking a cigar and drinking cold whiskey while enjoying the game."
                            icon={PlayingCards}
                        />
                        <Card
                            title="Quality in mind"
                            text="Our priority is provide you seamless gameplay and razor sharp visuals. The game allows for very low delay gameplay so you can make unbottlenecked decisions."
                            icon={Star}
                            className="stroke-white"
                        />
                    </div>
                </div>
            </Section>

            <Section className="flex w-full items-center justify-center bg-background p-10">
                <div className="flex w-full flex-col justify-center gap-5 lg:w-5/6 xl:w-9/12">
                    <div className="w-full text-6xl font-bold text-primary lg:text-8xl">
                        We say it&apos;s{" "}
                        <span className="text-secondary">fair</span>,{" "}
                        <a
                            onClick={() =>
                                alert(
                                    "You can't. bozo + L + don't care didn't ask + don't care + ratio + cope + counter ratio + skill issue + cry about it  + pinged owner + seethe + mald + stfu + no life + exposed + canceled + no life + denied + rat + counter ratio + blocked + backpilled + cancelled + stay mad"
                                )
                            }
                            className="cursor-pointer underline">
                            check
                        </a>{" "}
                        for yourself
                    </div>
                    <div className="text-xl font-light text-white">
                        Our website is fully RNG certified{" "}
                        <span className="text-transparent">:tf:</span> due to
                        using random generation algorithms that are{" "}
                        <a href="#" className="underline">
                            provably fair
                        </a>
                        . With this approach we can guarantee that you&apos;ll
                        have a pleasent experience playing and that the game is
                        fair for everyone.
                    </div>
                </div>
            </Section>
        </>
    );
}
