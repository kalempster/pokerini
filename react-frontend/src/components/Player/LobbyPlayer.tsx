import { MdMonetizationOn } from "react-icons/md";

type Props = {
    username: string;
    chips: number;
};

const LobbyPlayer = ({ username, chips }: Props) => {
    return (
        <div className="flex w-full items-center justify-between rounded-lg bg-twojstary p-2 text-white">
            <div className="flex items-center gap-2">
                <div className="flex aspect-square w-7 items-center justify-center rounded-full border-2 border-white bg-twojstary font-mono uppercase">
                    {username.at(0)}
                    {/* tu ma byc image zamiast A */}
                </div>
                <div>{username}</div>
            </div>
            <div className="flex items-center gap-1 font-mono">
                <MdMonetizationOn className="text-primary" />
                {chips}
            </div>
        </div>
    );
};

export default LobbyPlayer;
