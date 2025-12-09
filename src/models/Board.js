import Column from './Column.js';
import Card from './Card.js';

function uid(prefix = '') {
    return prefix + Math.random().toString(36).slice(2, 9);
}

export default class Board {
    constructor(title, columns = []) {
        this.title = title;
        this.columns = columns.map(c => (c instanceof Column ? c : Column.fromJSON(c)));
    }

    getColumnById(id) {
        return this.columns.find(c => c.id === id);
    }

    createCard(columnId, text, index = null) {
        const col = this.getColumnById(columnId);
        if (!col) return;
        const card = new Card(uid('card-'), text);
        col.addCard(card, index);
        return card;
    }

    moveCard(fromColId, toColId, cardId, toIndex) {
        const from = this.getColumnById(fromColId);
        const to = this.getColumnById(toColId);
        if (!from || !to) return;
        const card = from.cards.find(c => c.id === cardId);
        if (!card) return;
        from.removeCardById(cardId);
        to.addCard(card, toIndex);
    }

    removeCard(columnId, cardId) {
        const col = this.getColumnById(columnId);
        if (!col) return;
        col.removeCardById(cardId);
    }

    static fromJSON(src) {
        return new Board(src.title, src.columns || []);
    }

    toJSON() {
        return { title: this.title, columns: this.columns.map(c => c.toJSON()) };
    }
}
