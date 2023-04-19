import { ReactSVG } from "react-svg";
import Diler from "../images/diler.webp";
import Table from "../images/table.svg";
const Game = () => {
    return (
        <div className="h-[100lvh] w-[100lvw] flex items-center justify-center">
            <ReactSVG src={Table}>
                <div className="w-full absolute flex justify-center">
                    <img src={Diler} alt="" className="" />
                </div>
            </ReactSVG>
        </div>
    );
};

export default Game;
