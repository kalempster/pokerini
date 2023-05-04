import { ReactSVG } from "react-svg";
import Section from "../components/Section/Section";
import error from "../images/error.svg";
const ErrorPage = () => {
    return (
        <>
            <Section
                isFirst
                isSingle
                className="flex items-center justify-center ">
                <div className="flex w-3/4 flex-col gap-5 lg:w-2/3 lg:flex-row">
                    <ReactSVG
                        data-aos="fade-up"
                        src={error}
                        className="w-3/4"></ReactSVG>
                    <div
                        data-aos="fade-up"
                        className="flex text-3xl font-semibold text-white md:text-4xl lg:h-full lg:items-center lg:justify-center lg:text-5xl xl:text-6xl">
                        That&apos;s not what you are looking for!
                    </div>
                </div>
            </Section>
        </>
    );
};
export default ErrorPage;
