// Yes ik ik just overflow hidden but you know what, fuck you.
// I want the scrollbar to be visible so you take care of your mom (pilnuj starej)
export class ScrollLocker {
    static scrollY = window.scrollY;
    static locked = false;

    static scrollListener = window.addEventListener(
        "scroll",
        (e) => {
            if (this.locked) {
                e.preventDefault();
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore https://github.com/microsoft/TypeScript/issues/47441
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
