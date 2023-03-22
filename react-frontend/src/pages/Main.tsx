import Card from "../components/Card/Card";
import Section from "../components/Section";
import Coin from "../images/coin.svg";
import PlayingCards from "../images/playing-cards.svg";
import Star from "../images/star.svg";
import Header from "../components/Header/Header";
import Karty from "../images/karty.svg";
import { ReactSVG } from "react-svg";
export default function Main() {
    return (
        <>
            <Section className="bg-[#181B30] w-full h-full">
                <Header />
                <div className="py-24 flex w-full px-6 sm:px-10 xl:px-48 justify-center lg:justify-between">
                    <div className=" flex flex-col lg:w-1/3 sm:w-1/2 text-[#FFCD01] lg:justify-between ">
                        <div className=" text-5xl md:text-6xl font-bold ">
                            Piotrusiu fdfdsfsdfsd ccccccccccc:
                        </div>
                        <div className="text-3xl font-light">fair playxDD</div>
                        <button className="font-semibold w-full py-6 bg-[#EF2A4F] text-[#FFCD01] text-3xl ">
                            Countinue
                        </button>
                    </div>
                    <ReactSVG
                        src={Karty}
                        className="w-1/2 hidden justify-center items-center lg:flex"
                    />
                </div>
            </Section>

            <Section className="bg-[#181B30] flex justify-center items-center flex-col gap-5 p-10 w-full">
                <div className="text-5xl lg:text-6xl text-[#FFCD01] text-center">What do we offer?</div>
                <div className="w-full md:w-8/12 flex-col sm:flex-row flex justify-center gap-10 items-start">
                    <Card text="Our service is provided to you free of charge, forever. Enjoy the game of poker with your friends without having to pay a cent for it. Just create an acount and start playing!" />
                    <Card text="With our game you will feel like you're really sitting right there, at the table playing poker. Smoking a cigar and drinking cold whiskey while enjoying the game." />
                    <Card text="Our priority is provide you seamless gameplay and razor sharp visuals. The game allows for very low delay gameplay so you can make unbottlenecked decisions." />
                </div>
            </Section>
        </>
    );
}
