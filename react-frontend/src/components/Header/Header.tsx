import { Link, useNavigate } from "@tanstack/react-router";
import { ReactSVG } from "react-svg";
import burger from "../../images/burger.svg";
import useMenuStore from "./useMenuStore";
import { useJwtStore } from "../../stores/jwtStore";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useUserStore } from "../../stores/userStore";
import Player from "./Player";

// import numeral from "numeral";
// Ty sie irek dobrze czujesz?
// Juz na emeryture przechodzisz?
// To gowno nie bylo updatowane od 6 lat
// Jeden google search
// https://www.npmjs.com/package/react-number-format
export default function Header({
    showProfile,
    animated
}: {
    showProfile?: boolean;
    animated?: boolean;
}) {
    const menuStore = useMenuStore();
    const jwtStore = useJwtStore();

    // nie wiem czy mam dobre myslenie ale tera se mysle czy nie wystarczy
    // ze przy loginie dostaje przecierz kurwa dane i je do storea wjebac  i wszyscy szczesliwi,
    // ale zostawilem kod zeby wrazie co cofnac jak mnie zwyzywasz

    // irek po raz kolejny kopiujesz kod
    // i masz wypierdolone co robi
    // i do czego sluzy
    // ty sie nie ucz z kodu
    // ktory ja napisalem do aplikacji
    // ze tak sie robi
    // D O  K U R W Y  N E D Z Y
    // P A T R Z  D O  D O K U M E N T A C J I

    return (
        <>
            {/* Since our header is transparent anyway we justify the items to end and make the header smaller in index.css to make more space for content */}
            <div className=" absolute z-0 flex h-[var(--header-height)] w-full flex-row items-end justify-between bg-background px-4  md:px-32">
                <Link
                    to="/"
                    className="text-5xl font-semibold"
                    data-aos={animated && "fade-down"}>
                    <span className="text-secondary">Poker</span>
                    <span className="text-primary ">inee</span>
                </Link>
                {!jwtStore.isLoggedIn() ? (
                    <div className="hidden flex-row gap-16 text-primary md:text-2xl  lg:flex">
                        <Link
                            data-aos={animated && "fade-down"}
                            data-aos-delay="600"
                            to="/login">
                            Login
                        </Link>
                    </div>
                ) : showProfile ? (
                    <Player />
                ) : (
                    <div className="hidden flex-row gap-16 text-primary md:text-2xl  lg:flex">
                        <Link
                            data-aos={animated && "fade-down"}
                            data-aos-delay="600"
                            to="/dashboard">
                            Dashboard
                        </Link>
                    </div>
                )}

                <button
                    data-aos={animated && "fade-down"}
                    data-aos-delay="200"
                    className="flex border-none lg:hidden "
                    onClick={() => menuStore.setActive(!menuStore.active)}>
                    <ReactSVG
                        src={burger}
                        className="aspect-square w-10 stroke-primary"
                    />
                </button>
            </div>
        </>
    );
}
