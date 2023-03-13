import Card from "../components/Card";
import Section from "../components/Section";
import Coin from "../images/coin.svg";
import PlayingCards from "../images/playing-cards.svg";
import Star from "../images/star.svg";

export default function Main() {
    return (
        <>
            <Section className="text-white flex justify-center items-center w-full h-full p-10 bg-poker bg-center bg-cover bg-black bg-no-repeat shadow-innerSh">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="font-noto-serif text-6xl lg:text-8xl leading-[0.6] text-orange-700 ">
                        Pokerinee
                    </div>
                    <div className="font-dancing text-2xl lg:text-3xl text-gray-300 ">
                        The ultimate <span className="text-orange-600 font-dancing">poker</span>{" "}
                        experience for the new generation
                    </div>
                </div>
            </Section>
            <Section className="bg-black text-white flex justify-center items-center flex-col gap-5 p-10 w-full">
                <div className="text-5xl lg:text-6xl text-center">What do we offer?</div>
                <div className="w-full md:w-8/12 flex-col xl:flex-row flex justify-center gap-10 items-start">
                    <Card
                        title="Free of charge"
                        text="Our service is provided to you free of charge, forever. Enjoy the game of poker with your friends without having to pay a cent for it. Just create an acount and start playing!"
                        icon={Coin}
                        className="fill-orange-700"
                    />
                    <Card
                        title="Superb imerssion"
                        text="With our game you will feel like you're really sitting right there, at the table playing poker. Smoking a cigar and drinking cold whiskey while enjoying the game."
                        icon={PlayingCards}
                        className="fill-orange-700"
                    />
                    <Card
                        title="Quality in mind"
                        text="Our priority is provide you seamless gameplay and razor sharp visuals. The game allows for very low delay gameplay so you can make unbottlenecked decisions."
                        icon={Star}
                        className="fill-orange-700"
                    />
                </div>
            </Section>
        </>
    );
}
