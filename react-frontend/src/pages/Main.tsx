import Card from "../components/Card";
import Section from "../components/Section";
import Coin from "../images/coin.svg";

export default function Main() {
    return (
        <>
            <Section>
                <div className="h-full w-full bg-poker bg-center ">
                    <div className=" text-white backdrop-blur-lg backdrop-brightness-[.2] flex justify-center items-center w-full h-full">
                        <div className="flex flex-col items-center">
                            <div className="font-noto-serif text-8xl leading-[0.6] text-orange-700">
                                Pokerinee
                            </div>
                            <div className="font-dancing text-3xl text-gray-300 ">
                                The ultimate{" "}
                                <span className="text-orange-600 font-dancing">poker</span>{" "}
                                experience for the new generation
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
            <Section className="bg-black text-white flex justify-center items-center flex-col gap-5">
                <div className="text-6xl">What do we offer?</div>
                <div className="w-1/2 flex justify-center items-center gap-10">
                    <Card
                        title="Free of charge"
                        text="Our service is provided to you free of charge, forever. Enjoy the game of poker with your friend without having to pay a cent for it."
                        icon={Coin}
                        className="fill-orange-700"
                    />
                    <Card
                        title="Free of charge"
                        text="Our service is provided to you free of charge, forever. Enjoy the game of poker with your friend without having to pay a cent for it."
                        icon={Coin}
                        className="fill-orange-700"
                    />
                    <Card
                        title="Free of charge"
                        text="Our service is provided to you free of charge, forever. Enjoy the game of poker with your friend without having to pay a cent for it."
                        icon={Coin}
                        className="fill-orange-700"
                    />
                </div>
            </Section>
        </>
    );
}
