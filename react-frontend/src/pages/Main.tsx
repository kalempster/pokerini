import Card from "../components/Card/Card";
import Section from "../components/Section";
import Header from "../components/Header/Header";
import Karty from "../images/karty.svg";
import { ReactSVG } from "react-svg";
import Star from "../images/star.svg";
export default function Main() {
    return (
        <>
            <Header />

            <Section className="bg-[#181B30] w-full flex items-center">
                <div className="flex w-full px-4 md:px-28 2xl:px-72 justify-center lg:justify-between">
                    <div className="text-left gap-14 lg:text-left flex flex-col w-full lg:w-5/12 text-[#FFCD01] justify-between">
                        <div className=" text-5xl md:text-6xl font-bold flex flex-col gap-2">
                            Generations worth of work Poker experience
                            <div className="text-xl font-extralight text-[#FFCD01DA]">
                                Immerse yourself into the game of Poker and feel
                                the game like you&apos;ve never have felt
                                before.
                            </div>
                        </div>

                        <a className=" flex justify-center items-center rounded-[20px] font-semibold w-full py-6 bg-[#EF2A4F] text-[#FFCD01] text-3xl ">
                            Countinue
                        </a>
                    </div>
                    <div className="w-1/2 hidden items-center lg:flex">
                        <ReactSVG src={Karty} className="w-full" />
                    </div>
                </div>
            </Section>

            <Section className="bg-[#181B30] flex justify-center items-center flex-col gap-5 p-10 w-full">
                <div className="text-5xl lg:text-6xl text-[#FFCD01] text-center font-bold">
                    What do we offer?
                </div>
                <div className="w-full md:11/12 lg:w-10/12 xl:w-9/12 flex-col sm:flex-row flex justify-center gap-10 items-stretch">
                    <Card
                        title="Free forever"
                        text="Our service is provided to you free of charge, forever. Enjoy the game of poker with your friends without having to pay a cent for it. Just create an acount and start playing!"
                        icon=""
                    />
                    <Card
                        title="Superb immersion"
                        text="With our game you will feel like you're really sitting right there, at the table playing poker. Smoking a cigar and drinking cold whiskey while enjoying the game."
                    />
                    <Card
                        title="Quality in mind"
                        text="Our priority is provide you seamless gameplay and razor sharp visuals. The game allows for very low delay gameplay so you can make unbottlenecked decisions."
                        icon={Star}
                        className="fill-[#FFCD01]"
                    />
                </div>
            </Section>
        </>
    );
}
