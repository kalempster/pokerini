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
            <Header />

            <Section className="bg-[#181B30] w-full flex items-center" isStarting>
                <div className="flex w-full px-4 md:px-28 2xl:px-72 justify-center lg:justify-between">
                    <div className="text-center lg:text-left flex flex-col w-full lg:w-5/12 text-[#FFCD01] justify-between">
                        <div className=" text-5xl md:text-6xl font-bold ">
                            Generations worth of work Poker experience
                            <div className="text-xl font-light text-[#FFCD01DA]">
                                Immerse yourself into the game of Poker and feel the game like
                                you've never have felt before.
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
                <div className="text-5xl lg:text-6xl text-[#FFCD01] text-center">
                    What do we offer?
                </div>
                <div className="w-full md:w-11/12 flex-col sm:flex-row flex justify-center gap-10 items-start">
                    <Card title="Free forever" text="Lorem ipsum dolor sit amet consectetur adipisicing elit. A, quo. Delectus sequi eos, laborum doloribus voluptatibus incidunt expedita tempora sunt." />
                    <Card title="siema" text="Lorem ipsum dolor sit amet consectetur adipisicing elit. A, quo. Delectus sequi eos, laborum doloribus voluptatibus incidunt expedita tempora sunt." />
                    <Card title="elo" text="Lorem ipsum dolor sit amet consectetur adipisicing elit. A, quo. Delectus sequi eos, laborum doloribus voluptatibus incidunt expedita tempora sunt." />
                </div>
            </Section>
        </>
    );
}
