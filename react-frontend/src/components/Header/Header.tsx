import { Link } from "@tanstack/react-router";
import { ReactSVG } from "react-svg";
import burger from "../../images/burger.svg";
import useMenuStore from "./useMenuStore";
import { useJwtStore } from "../../stores/jwtStore";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { useUserStore } from "../../stores/userStore";
export default function Header() {
    const menuStore = useMenuStore();
    const jwtStore = useJwtStore();
    const userStore = useUserStore();
    const { refetch } = trpc.auth.me.useQuery();
    console.log(refetch());

    const onRefresh = async () => {
        const data = await refetch();

        if (data.isError) return;
        console.log(data.data);
        userStore.setUser({
            ...data.data!,
            createdAt: new Date(data.data!.createdAt),
            updatedAt: new Date(data.data!.updatedAt)
        });
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
                    <div className="flex whitespace-pre-wrap text-xl text-primary">
                        <div>{data.chips} </div>
                        <div>{data.username}</div>
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
