import ColumnView from './ColumnView.js';
import DragManager from './DragManager.js';

export default class BoardView {
    constructor(state, onChange) {
        this.state = state;
        this.onChange = onChange;
        this.dragManager = new DragManager(this);
    }

    render(root) {
        if (!this.root && root) this.root = root;
        const boardEl = this.root.querySelector('#board') || document.createElement('div');
        boardEl.id = 'board';
        boardEl.innerHTML = '';
        this.state.board.columns.forEach(col => {
            const colView = new ColumnView(col, this);
            boardEl.append(colView.render());
        });
        if (!this.root.contains(boardEl)) this.root.append(boardEl);

        this.dragManager.init();
    }

    refresh() {
        const root = document.getElementById('board');
        this.onChange(this.state);
        this.render(root);
    }
}
