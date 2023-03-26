export class ScrollLocker {
    static scrollY = window.scrollY;
    static locked = false;

    static scrollListener = window.addEventListener(
        "scroll",
        (e) => {
            if (this.locked) {
                e.preventDefault();
                window.scrollTo({ behavior: "instant", top: this.scrollY });
            }
        },
        { passive: false }
    );

    static wheelListener = window.addEventListener(
        "wheel",
        (e) => {
            if (this.locked) e.preventDefault();
        },
        { passive: false }
    );

    static touchListener = window.addEventListener(
        "touchmove",
        (e) => {
            if (this.locked) e.preventDefault();
        },
        { passive: false }
    );

    static lock() {
        this.locked = true;
        this.scrollY = window.scrollY;
    }

    static unlock() {
        this.locked = false;
    }
}
