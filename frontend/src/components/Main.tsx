import Section from "./Section";

const Main = () => {
    return (
        <>
            <Section class="snap-center">
                <div class="h-full w-full bg-poker bg-center ">
                    <div class=" text-white backdrop-blur-lg backdrop-brightness-[.2] flex justify-center items-center w-full h-full">
                        <div class="flex flex-col items-center">
                            <div class="font-noto-serif text-8xl leading-[0.6] text-orange-700">Pokerinee</div>
                            <div class="font-dancing text-3xl text-gray-300 ">
                                The ultimate <span class="text-orange-600">poker</span> experience for the new generation
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
            <Section class="snap-center">
                <div>x</div>
            </Section>
        </>
    );
};

export default Main;
