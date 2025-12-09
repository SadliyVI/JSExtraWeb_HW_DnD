import CardView from './CardView.js';

export default class ColumnView {
    constructor(column, boardView) {
        this.column = column;
        this.boardView = boardView;
    }

    render() {
        const colEl = document.createElement('div');
        colEl.className = 'column';
        colEl.dataset.columnId = this.column.id;
        colEl.style.setProperty('--col-bg', '#f7f9fa');

        const header = document.createElement('div');
        header.className = 'column-header';
        header.textContent = this.column.title;
        colEl.append(header);

        const cardsWrapper = document.createElement('div');
        cardsWrapper.className = 'cards';
        cardsWrapper.dataset.cardsFor = this.column.id;

        this.column.cards.forEach(card => {
            const cardView = new CardView(card, this.column, this.boardView);
            cardsWrapper.append(cardView.render());
        });

        colEl.append(cardsWrapper);

        const addArea = document.createElement('div');
        addArea.className = 'add-area';

        const addTrigger = document.createElement('button');
        addTrigger.className = 'add-trigger';
        addTrigger.textContent = '+ Add another card';
        addArea.append(addTrigger);

        const addForm = document.createElement('div');
        addForm.className = 'add-form';
        addForm.style.display = 'none';

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Enter a title for this card';
        addForm.append(textarea);

        const actions = document.createElement('div');
        actions.className = 'form-actions';

        const btnAdd = document.createElement('button');
        btnAdd.className = 'btn-add';
        btnAdd.textContent = 'Add card';

        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn-cancel';
        btnCancel.textContent = '✕';

        actions.append(btnAdd);
        actions.append(btnCancel);
        addForm.append(actions);

        addArea.append(addForm);
        colEl.append(addArea);

        addTrigger.addEventListener('click', () => {
            addTrigger.style.display = 'none';
            addForm.style.display = 'block';
            textarea.focus();
        });

        btnCancel.addEventListener('click', () => {
            textarea.value = '';
            addForm.style.display = 'none';
            addTrigger.style.display = 'block';
        });

        btnAdd.addEventListener('click', () => {
            const text = textarea.value.trim();
            if (!text) return;
            this.boardView.state.board.createCard(this.column.id, text);
            textarea.value = '';
            addForm.style.display = 'none';
            addTrigger.style.display = 'block';
            this.boardView.onChange(this.boardView.state);
            this.boardView.refresh();
        });

        return colEl;
    }
}
