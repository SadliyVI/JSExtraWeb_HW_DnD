export default class CardView {
    constructor(card, column, boardView) {
        this.card = card;
        this.column = column;
        this.boardView = boardView;
    }

    render() {
        const el = document.createElement('div');
        el.className = 'card';
        el.draggable = false;
        el.dataset.cardId = this.card.id;
        el.dataset.columnId = this.column.id;

        const txt = document.createElement('div');
        txt.className = 'card-text';
        txt.textContent = this.card.text;

        const del = document.createElement('div');
        del.className = 'delete-btn';
        del.innerHTML = '✕';
        del.title = 'Delete card';

        el.append(txt);
        el.append(del);

        del.addEventListener('click', (e) => {
            e.stopPropagation();
            this.boardView.state.board.removeCard(this.column.id, this.card.id);
            this.boardView.onChange(this.boardView.state);
            this.boardView.refresh();
        });

        el.addEventListener('pointerdown', (e) => {
            e.preventDefault();
        });

        return el;
    }
}
