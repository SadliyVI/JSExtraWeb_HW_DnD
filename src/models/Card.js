export default class Card {
    constructor(id, text) {
        this.id = id;
        this.text = text;
    }

    static fromJSON(src) {
        return new Card(src.id, src.text);
    }

    toJSON() {
        return { id: this.id, text: this.text };
    }
}
