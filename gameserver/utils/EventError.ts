class EventError extends Error {
    constructor(message: string, errorObject: {code: number, }) {
        super(message);

        Object.setPrototypeOf(this, EventError.prototype);
    }
}
