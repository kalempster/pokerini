import { useState } from "react";
import { useUserStore } from "../../stores/userStore";
import { useJwtStore } from "../../stores/jwtStore";
import { trpc } from "../../utils/trpc";
import { useNavigate } from "@tanstack/react-router";

const Player = () => {
    const [menu, setMenu] = useState(false);
    const userStore = useUserStore();
    const jwtStore = useJwtStore();
    const mutation = trpc.auth.logout.useMutation();

    const navigate = useNavigate();

    const logout = async () => {
        try {
            await mutation.mutateAsync({
                refreshToken: jwtStore.refreshToken
            });
            jwtStore.setAccessToken("");
            jwtStore.setRefreshToken("");
            navigate({ to: "/login" });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="relative">
            <div
                onClick={() => {
                    setMenu(!menu);
                }}
                className="flex cursor-pointer select-none gap-2 whitespace-pre-wrap rounded-full bg-twojstary px-6 py-3 text-xl text-primary">
                <div>{userStore.user.chips}</div>
                <div>{userStore.user.username}</div>
                <div>v</div>
            </div>
            <div
                onClick={() => {
                    setMenu(!menu);
                }}
                className={`absolute ${
                    menu ? "flex" : "hidden"
                } w-full rounded-xl rounded-tl-none rounded-tr-none bg-twojstary px-6 py-3 text-center text-xl text-primary`}>
                <button
                    onClick={() => {
                        logout();
                    }}>
                    Log out
                </button>
            </div>
        </div>
    );
};

export default Player;
