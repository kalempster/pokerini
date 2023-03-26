export class ScrollLocker {
    static scrollY = window.scrollY;
    static locked = false;
    static listener = window.addEventListener("scroll", () => {
        if (this.locked)
            window.scroll({ behavior: "instant", top: this.scrollY });
    });

    static lock() {
        this.locked = true;
        this.scrollY = window.scrollY;
    }

    static unlock() {
        this.locked = false;
    }
}
