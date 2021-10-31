export class Test {
    #message;
    constructor(message) {
        this.#message = message;
    }

    sayMessage() {
        console.log(this.#message);
    }
}