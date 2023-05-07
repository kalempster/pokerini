import { Link, useNavigate } from "@tanstack/react-router";
import { ReactSVG } from "react-svg";
import burger from "../../images/burger.svg";
import useMenuStore from "./useMenuStore";
import { useJwtStore } from "../../stores/jwtStore";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useUserStore } from "../../stores/userStore";
import numeral from "numeral";
export default function Header() {
    const menuStore = useMenuStore();
    const jwtStore = useJwtStore();
    const userStore = useUserStore();
    const { refetch } = trpc.auth.me.useQuery();
    const [menu, setMenu] = useState(false);
    const navigate = useNavigate();
    const onRefresh = async () => {
        const data = await refetch();

        if (data.isError) return;

        userStore.setUser({
            ...data.data!,
            createdAt: new Date(data.data!.createdAt),
            updatedAt: new Date(data.data!.updatedAt)
        });
    };
    const mutation = trpc.auth.logout.useMutation();

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
    useEffect(() => {
        if (userStore.user.username == "") {
            onRefresh();
        }
    }, [userStore.user]);
    // nie wiem czy mam dobre myslenie ale tera se mysle czy nie wystarczy
    // ze przy loginie dostaje przecierz kurwa dane i je do storea wjebac  i wszyscy szczesliwi,
    // ale zostawilem kod zeby wrazie co cofnac jak mnie zwyzywasz
    const data = userStore.user;

    return (
        <>
            {/* Since our header is transparent anyway we justify the items to end and make the header smaller in index.css to make more space for content */}
            <div className=" absolute z-0 flex h-[var(--header-height)] w-full flex-row items-end justify-between bg-background px-4  md:px-32">
                <Link
                    to="/"
                    className="text-5xl font-semibold"
                    data-aos="fade-down">
                    <span className="text-secondary">Poker</span>
                    <span className="text-primary ">inee</span>
                </Link>
                {!jwtStore.isLoggedIn() ? (
                    <div className="hidden flex-row gap-16 text-primary md:text-2xl  lg:flex">
                        <Link
                            data-aos="fade-down"
                            data-aos-delay="600"
                            to="/login">
                            login
                        </Link>
                    </div>
                ) : (
                    <div>
                        <div
                            onClick={() => {
                                setMenu(!menu);
                            }}
                            className="whitespace-pre-wrap flex gap-2 rounded-xl  bg-twojstary px-6 py-3 text-xl text-primary">
                            <div>{numeral(data.chips).format("0.0a")}</div>
                            <div>{data.username}</div>
                            <div>v</div>
                        </div>
                        <div
                            onClick={() => {
                                setMenu(!menu);
                            }}
                            className={
                                menu
                                    ? "top absolute z-10 flex min-w-[150px] rounded-xl bg-twojstary px-6 py-3 text-center text-xl text-primary"
                                    : "top absolute z-10 hidden min-w-[150px] rounded-xl bg-twojstary px-6 py-3 text-center text-xl text-primary"
                            }>
                            <button
                                onClick={() => {
                                    logout();
                                }}>
                                Log out
                            </button>
                        </div>
                    </div>
                )}

                <button
                    data-aos="fade-down"
                    data-aos-delay="200"
                    className="flex border-none lg:hidden "
                    onClick={() => menuStore.setActive(!menuStore.active)}>
                    <ReactSVG
                        src={burger}
                        className="aspect-square w-10 stroke-primary"
                    />
                </button>
                {/* TODO profile handling and login/logout */}
            </div>
        </>
    );
}
