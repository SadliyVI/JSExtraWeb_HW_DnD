export default class DragManager {
    constructor(boardView) {
        this.boardView = boardView;
        this.dragging = null;
        this.mirror = null;
        this.placeholder = null;
        this.currentTargetColumn = null;
        this.currentInsertIndex = null;
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
    }

    init() {
        const root = this.boardView.root.querySelector('#board');
        if (!root) return;
        root.addEventListener('pointerdown', this.onPointerDown);
    }

    findCardElement(el) {
        while (el && !el.classList?.contains('card')) el = el.parentElement;
        return el;
    }

    findColumnElement(el) {
        while (el && !el.classList?.contains('column')) el = el.parentElement;
        return el;
    }

    onPointerDown(e) {
        const cardEl = this.findCardElement(e.target);
        if (!cardEl || e.target.classList?.contains('delete-btn')) return;

        cardEl.setPointerCapture(e.pointerId);

        const rect = cardEl.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        this.dragging = {
            cardEl,
            cardId: cardEl.dataset.cardId,
            fromColumnId: cardEl.dataset.columnId,
            originalRect: rect,
            offsetX,
            offsetY,
            pointerId: e.pointerId
        };

        this.mirror = cardEl.cloneNode(true);
        this.mirror.classList.add('drag-mirror');
        this.mirror.style.width = `${rect.width}px`;
        this.mirror.style.height = `${rect.height}px`;
        this.mirror.style.position = 'fixed';
        this.mirror.style.left = `${rect.left}px`;
        this.mirror.style.top = `${rect.top}px`;
        this.mirror.style.pointerEvents = 'none';
        this.mirror.style.opacity = '0.85';
        document.body.appendChild(this.mirror);

        this.placeholder = document.createElement('div');
        this.placeholder.className = 'placeholder';
        this.placeholder.style.height = `${rect.height}px`;

        cardEl.parentNode.insertBefore(this.placeholder, cardEl);
        cardEl.style.display = 'none';
        cardEl.classList.add('dragging');

        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
    }

    onPointerMove(e) {
        if (!this.dragging) return;
        e.preventDefault();

        const { offsetX, offsetY } = this.dragging;
        this.mirror.style.left = `${e.clientX - offsetX}px`;
        this.mirror.style.top = `${e.clientY - offsetY}px`;

        const elUnder = document.elementFromPoint(e.clientX, e.clientY);
        const columnEl = this.findColumnElement(elUnder);
        if (!columnEl) return;

        const cardsContainer = columnEl.querySelector('.cards');
        if (!cardsContainer) return;

        this.currentTargetColumn = columnEl;

        const children = Array.from(cardsContainer.children).filter(c => !c.classList.contains('drag-mirror'));
        let insertBeforeNode = null;
        let insertIndex = children.length;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const r = child.getBoundingClientRect();
            if (e.clientY < r.top + r.height / 2) {
                insertBeforeNode = child;
                insertIndex = i;
                break;
            }
        }

        if (insertBeforeNode) {
            cardsContainer.insertBefore(this.placeholder, insertBeforeNode);
        } else {
            cardsContainer.appendChild(this.placeholder);
        }

        this.currentInsertIndex = insertIndex;
    }

    onPointerUp() {
        if (!this.dragging) return;

        const { cardEl, fromColumnId, cardId } = this.dragging;
        let toColumnId = fromColumnId;
        let insertIndex = undefined;

        if (this.placeholder && this.placeholder.parentElement) {
            const parent = this.placeholder.parentElement;
            const colEl = this.findColumnElement(parent);
            toColumnId = colEl.dataset.columnId;
            insertIndex = Array.from(parent.children).indexOf(this.placeholder);
        }

        this.boardView.state.board.moveCard(fromColumnId, toColumnId, cardId, insertIndex);
        this.boardView.onChange(this.boardView.state);

        if (this.mirror?.parentElement) this.mirror.parentElement.removeChild(this.mirror);
        if (this.placeholder?.parentElement) this.placeholder.parentElement.removeChild(this.placeholder);

        cardEl.style.display = 'block';
        cardEl.classList.remove('dragging');

        this.dragging = null;
        this.mirror = null;
        this.placeholder = null;
        this.currentTargetColumn = null;
        this.currentInsertIndex = null;

        document.body.classList.remove('dragging');
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);

        this.boardView.refresh();
    }
}
