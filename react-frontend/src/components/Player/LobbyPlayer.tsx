import { MdMonetizationOn } from "react-icons/md";
import { useUserStore } from "../../stores/userStore";
import { useGameStore } from "../../stores/gameStore";
import { useSocket } from "src/utils/wsclient";
import { KickPlayer } from "@gameserver/shared/messages";

type Props = {
    username: string;
    chips: number;
    id: string;
};

const LobbyPlayer = ({ username, chips, id }: Props) => {
    const userStore = useUserStore();

    const gameStore = useGameStore();

    const client = useSocket();

    const kickPlayer = () => {
        client.send(
            KickPlayer,
            { lobbyId: gameStore.id, targetUserId: id },
            undefined
        );
    };

    return (
        <div className="flex w-full items-center justify-between rounded-lg bg-twojstary p-2 text-white">
            <div className="flex items-center gap-2">
                <div className="flex aspect-square w-7 items-center justify-center rounded-full border-2 border-white bg-twojstary font-mono uppercase">
                    {username.at(0)}
                    {/* tu ma byc image zamiast A */}
                </div>
                <div>{username}</div>
            </div>
            <div className="flex items-center gap-2 ">
                <div className=" flex items-center gap-1 font-mono">
                    <MdMonetizationOn className="text-primary" />
                    {chips}
                </div>
                {/* eslint-disable indent */}
                {userStore.user.id == gameStore.hostId &&
                userStore.user.id != id ? (
                    <button
                        onClick={kickPlayer}
                        className="select-none font-mono">
                        X
                    </button>
                ) : (
                    <></>
                )}
                {/* eslint-enable indent */}
            </div>
        </div>
    );
};

export default LobbyPlayer;
