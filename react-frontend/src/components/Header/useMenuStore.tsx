import { create } from "zustand";

type MenuState = {
    active: boolean;
    setActive: (active: boolean) => any;
};

const useMenuStore = create<MenuState>((set) => ({
    active: false,
    setActive: (active) => set(() => ({ active }))
}));

export default useMenuStore;
