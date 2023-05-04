import GamePlayer from "../components/Player/GamePlayer";
import Diler from "../images/diler.png";
const Game = () => {
    return (
        <div className="flex h-[100lvh] items-center justify-center">
            <div className="relative flex w-full items-center justify-center lg:w-7/12">
                <img
                    src={Diler}
                    className="absolute top-0 h-52 -translate-y-full"
                />
                <div className="absolute text-primary">1000</div>
                <GamePlayer
                    username="jdkurwe"
                    currentChips={300}
                    playerIndex={0}
                />
                <GamePlayer
                    username="cwel"
                    currentChips={120}
                    playerIndex={1}
                />
                <GamePlayer
                    username="kalempster"
                    currentChips={3000}
                    playerIndex={2}
                />
                <GamePlayer
                    username="irek_hazardownik26"
                    currentChips={30123}
                    playerIndex={3}
                />
                <GamePlayer
                    username="mikolaj_siec"
                    currentChips={2314}
                    playerIndex={4}
                />

                <svg
                    className="aspect-[1194/544] w-full max-w-[1120px]"
                    viewBox="0 0 1194 544"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M13 189.654C13 92.0905 92.0574 13 189.58 13H1004.42C1101.94 13 1181 92.0905 1181 189.654V354.346C1181 451.909 1101.94 531 1004.42 531H189.58C92.0574 531 13 451.909 13 354.346V189.654Z"
                        fill="#222643"
                    />
                    <path
                        d="M975.773 60.0642H215.468C130.634 60.0642 61.8628 123.322 61.8628 201.355V342.645C61.8628 420.678 130.634 483.936 215.468 483.936H975.773C1060.61 483.936 1129.38 420.678 1129.38 342.645V201.355C1129.38 123.322 1060.61 60.0642 975.773 60.0642Z"
                        fill="#222643"
                    />
                    <path
                        d="M13 189.654C13 92.0905 92.0574 13 189.58 13H1004.42C1101.94 13 1181 92.0905 1181 189.654V354.346C1181 451.909 1101.94 531 1004.42 531H189.58C92.0574 531 13 451.909 13 354.346V189.654Z"
                        stroke="#1E2139"
                        strokeWidth="26"
                    />
                    <path
                        d="M975.773 60.0642H215.468C130.634 60.0642 61.8628 123.322 61.8628 201.355V342.645C61.8628 420.678 130.634 483.936 215.468 483.936H975.773C1060.61 483.936 1129.38 420.678 1129.38 342.645V201.355C1129.38 123.322 1060.61 60.0642 975.773 60.0642Z"
                        stroke="#1E2139"
                        strokeWidth="26"
                    />
                </svg>
            </div>
        </div>
    );
};

export default Game;
