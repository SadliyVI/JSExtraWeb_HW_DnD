import Card from './Card.js';

export default class Column {
    constructor(id, title, cards = []) {
        this.id = id;
        this.title = title;
        this.cards = cards.map(c => (c instanceof Card ? c : Card.fromJSON(c)));
    }

    addCard(card, index = null) {
        if (index === null) this.cards.push(card);
        else this.cards.splice(index, 0, card);
    }

    removeCardById(cardId) {
        const idx = this.cards.findIndex(c => c.id === cardId);
        if (idx >= 0) this.cards.splice(idx, 1);
    }

    static fromJSON(src) {
        return new Column(src.id, src.title, src.cards || []);
    }

    toJSON() {
        return { id: this.id, title: this.title, cards: this.cards.map(c => c.toJSON()) };
    }
}
