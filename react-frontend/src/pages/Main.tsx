import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import Card from "../components/Card/Card";
import Dialog from "../components/Dialog/Dialog";
import Section from "../components/Section/Section";
import Coin from "../images/coin.svg";
import Karty from "../images/karty.svg";
import PlayingCards from "../images/playing-cards.svg";
import Star from "../images/shine.svg";
import Header from "../components/Header/Header";
import Feeter from "../components/Feeter/Feeter";
import { useJwtStore } from "../stores/jwtStore";

export default function Main() {
    const [bozoVisible, setBozoVisible] = useState(false);
    const jwtStore = useJwtStore();

    return (
        <>
            <Header />
            <Section className="flex w-full items-center bg-background" isFirst>
                <div className="flex w-full justify-center px-4 md:px-28 lg:justify-between 2xl:px-72">
                    <div
                        data-aos="fade-right"
                        data-aos-delay="200"
                        className="flex w-full flex-col justify-between gap-14 text-left text-primary lg:w-5/12 lg:text-left">
                        <div className=" flex flex-col gap-2 text-5xl font-bold md:text-6xl">
                            Generations worth of work Poker experience
                            <div className="text-xl font-extralight text-[#FFCD01DA]">
                                Immerse yourself into the game of Poker and feel
                                it like you&apos;ve never have felt before.
                            </div>
                        </div>

                        <Link
                            to="/sign-up"
                            className=" flex w-full cursor-pointer items-center justify-center rounded-[20px] bg-secondary py-6 text-3xl font-semibold text-primary ">
                            Join now
                        </Link>
                    </div>
                    <div
                        data-aos="fade-left"
                        data-aos-delay="200"
                        className="hidden w-1/2 items-center lg:flex">
                        <ReactSVG src={Karty} className="w-full" />
                    </div>
                </div>
            </Section>

            <Section className="flex w-full flex-col items-center justify-center bg-background p-10">
                <div className="flex w-full flex-col  justify-center gap-10 lg:w-5/6 xl:w-9/12">
                    <div
                        data-aos="fade-down"
                        className="w-full text-6xl font-bold text-primary lg:text-8xl">
                        What do we offer?
                    </div>
                    <div className="flex  flex-col items-stretch gap-10 lg:flex-row">
                        <Card
                            divClassName="mt-5"
                            data-aos="fade-up"
                            data-aos-delay="400"
                            title="Superb immersion"
                            text="With our game you will feel like you're really sitting right there, at the table playing poker, smoking a cigar and drinking cold whiskey while enjoying the game."
                            icon={PlayingCards}
                        />
                        <Card
                            data-aos="fade-up"
                            data-aos-delay="200"
                            title="Free forever"
                            text="Our service is provided to you free of charge, forever. Enjoy the game of poker with your friends without having to pay a cent for it. Just create an acount and start playing!"
                            icon={Coin}
                        />
                        <Card
                            divClassName="mt-5"
                            data-aos="fade-up"
                            data-aos-delay="600"
                            title="Quality in mind"
                            text="Our priority is to provide you with seamless gameplay and razor sharp visuals. The game allows for highly reactive gameplay so you can make quick decisions."
                            icon={Star}
                            className="stroke-white"
                        />
                    </div>
                </div>
            </Section>

            <Section className="flex w-full items-center justify-center bg-background p-10">
                <div className="flex w-full flex-col justify-center gap-5 lg:w-5/6 xl:w-9/12">
                    <div
                        data-aos="fade-down"
                        className="w-full text-6xl font-bold text-primary lg:text-8xl">
                        We say it&apos;s{" "}
                        <span className="text-secondary">fair</span>,{" "}
                        <a
                            onClick={() => setBozoVisible(true)}
                            className="cursor-pointer underline">
                            check
                        </a>{" "}
                        for yourself
                    </div>
                    <div
                        data-aos="fade-up"
                        data-aos-delay="200"
                        className="text-xl font-light text-white">
                        Our website is fully RNG certified{" "}
                        <span className="text-transparent">:tf:</span> Through
                        random generation algorithms every hand dealt is
                        verifiable thanks to a{" "}
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://www.provably.com/"
                            className="underline">
                            provably fair
                        </a>{" "}
                        algorithm
                        {/* Get scammed provably fair was the right word for it since we're linking to a provalby.com website */}
                        . With this approach we can guarantee that you&apos;ll
                        have a pleasant experience playing a fair and honest
                        game for everyone
                    </div>
                </div>
            </Section>
            <Dialog
                visible={bozoVisible}
                onDismiss={() => setBozoVisible(false)}>
                <Dialog.Title>Lol you can&apos;t</Dialog.Title>
                <Dialog.Content>
                    You can&apos;t. bozo + L + don&apos;t care didn&apos;t ask +
                    don&apos;t care + ratio + cope + counter ratio + skill issue
                    + cry about it + pinged owner + seethe + mald + stfu + no
                    life + exposed + canceled + no life + denied + rat + counter
                    ratio + blocked + backpilled + cancelled + stay mad
                </Dialog.Content>
            </Dialog>
            <Feeter />
        </>
    );
}
