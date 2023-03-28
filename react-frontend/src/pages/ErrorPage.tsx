import { ReactSVG } from "react-svg"
import Section from "../components/Section/Section"
import error from "../images/error.svg"
const ErrorPage =()=>{
    return <>
    <Section isFirst isSingle className="flex items-center justify-center ">
        <div className="flex gap-5 w-3/4 lg:w-2/3 flex-col lg:flex-row">
            <ReactSVG   data-aos="fade-up" src={error} className="w-3/4"></ReactSVG>
            <div   data-aos="fade-up" className="flex text-white font-semibold text-3xl md:text-4xl lg:text-5xl xl:text-6xl lg:h-full lg:items-center lg:justify-center">That’s not what you
are looking for!</div>
        </div>
    </Section>
    </>
}
export default ErrorPage