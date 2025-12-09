// export default class DragManager {
//     constructor(boardView) {
//         this.boardView = boardView;
//         this.root = null;

//         // state
//         this.dragging = null; // { cardEl, cardId, fromColumnId, originalRect, offsetX, offsetY }
//         this.mirror = null;
//         this.placeholder = null;
//         this.currentTargetColumn = null;
//         this.currentInsertIndex = null;

//         // binding
//         this.onPointerDown = this.onPointerDown.bind(this);
//         this.onPointerMove = this.onPointerMove.bind(this);
//         this.onPointerUp = this.onPointerUp.bind(this);
//     }

//     init() {
//         this.root = document.getElementById('board');
//         if (!this.root) return;
//         // delegate pointerdown from cards
//         this.root.addEventListener('pointerdown', this.onPointerDown);
//     }

//     findCardElement(el) {
//         while (el && !el.classList?.contains('card')) el = el.parentElement;
//         return el;
//     }

//     onPointerDown(e) {
//         const cardEl = this.findCardElement(e.target);
//         if (!cardEl) return;
//         // don't start drag if clicked delete button
//         if (e.target.classList && e.target.classList.contains('delete-btn')) return;

//         // capture pointer
//         cardEl.setPointerCapture(e.pointerId);

//         const rect = cardEl.getBoundingClientRect();
//         const offsetX = e.clientX - rect.left;
//         const offsetY = e.clientY - rect.top;

//         this.dragging = {
//             cardEl,
//             cardId: cardEl.dataset.cardId,
//             fromColumnId: cardEl.dataset.columnId,
//             originalRect: rect,
//             offsetX,
//             offsetY,
//             pointerId: e.pointerId
//         };

//         // create mirror
//         this.createMirror(cardEl, rect, offsetX, offsetY);
//         // create placeholder element sized like card
//         this.placeholder = document.createElement('div');
//         this.placeholder.className = 'placeholder';
//         this.placeholder.style.height = `${rect.height}px`;
//         this.placeholder.style.width = `${rect.width}px`;

//         // mark dragging style
//         cardEl.classList.add('dragging');
//         document.body.classList.add('dragging');

//         // hide original from layout by inserting placeholder where it was
//         const parentCards = cardEl.parentElement;
//         parentCards.replaceChild(this.placeholder, cardEl);

//         // keep original element as mirror source (we'll use the original cardEl detached)
//         // attach pointermove/up to window to track outside the board
//         window.addEventListener('pointermove', this.onPointerMove);
//         window.addEventListener('pointerup', this.onPointerUp);
//     }

//     createMirror(cardEl, rect, offsetX, offsetY) {
//         this.mirror = cardEl.cloneNode(true);
//         this.mirror.classList.add('drag-mirror');
//         this.mirror.style.width = `${rect.width}px`;
//         this.mirror.style.height = `${rect.height}px`;
//         this.mirror.style.left = `${rect.left}px`;
//         this.mirror.style.top = `${rect.top}px`;
//         this.mirror.style.transformOrigin = 'top left';
//         this.mirror.style.position = 'fixed';
//         this.mirror.style.margin = '0';
//         this.mirror.style.boxSizing = 'border-box';
//         this.mirror.style.pointerEvents = 'none';
//         this.mirror.dataset.dragMirror = 'true';
//         document.body.appendChild(this.mirror);

//         // store grabbing offset in mirror dataset for use while moving
//         this.mirror.dataset.offsetX = offsetX;
//         this.mirror.dataset.offsetY = offsetY;
//     }

//     onPointerMove(e) {
//         if (!this.dragging) return;
//         e.preventDefault();

//         // move mirror so grabbing point stays under cursor
//         const offsetX = parseFloat(this.mirror.dataset.offsetX);
//         const offsetY = parseFloat(this.mirror.dataset.offsetY);
//         const left = e.clientX - offsetX;
//         const top = e.clientY - offsetY;
//         this.mirror.style.left = `${left}px`;
//         this.mirror.style.top = `${top}px`;

//         // detect column under pointer
//         const elUnder = document.elementFromPoint(e.clientX, e.clientY);
//         const columnEl = this.findColumnElement(elUnder);
//         if (!columnEl) {
//             // if not over column, remove any placeholder from previous column
//             this.removePlaceholderFromCurrent();
//             return;
//         }

//         // get cards container for that column
//         const cardsContainer = columnEl.querySelector('.cards');
//         if (!cardsContainer) return;

//         this.currentTargetColumn = columnEl;
//         // find insert index by comparing y coordinate to children
//         const children = Array.from(cardsContainer.querySelectorAll('.card, .placeholder'));
//         let insertBeforeNode = null;
//         let insertIndex = children.length; // by default at end

//         for (let i = 0; i < children.length; i++) {
//             const child = children[i];
//             const r = child.getBoundingClientRect();
//             // Determine whether to place before or after by cursor vertical position relative to child's middle
//             const midpoint = r.top + r.height / 2;
//             if (e.clientY < midpoint) {
//                 insertBeforeNode = child;
//                 insertIndex = i;
//                 break;
//             }
//         }

//         // If inserting into empty column, index is 0
//         if (children.length === 0) {
//             insertIndex = 0;
//             insertBeforeNode = null;
//         }

//         // If placeholder is already in correct position, do nothing
//         const placeholderParent = this.placeholder.parentElement;
//         if (placeholderParent === cardsContainer) {
//             const currentIndex = Array.from(cardsContainer.children).indexOf(this.placeholder);
//             if (currentIndex === insertIndex) return;
//         }

//         // ensure placeholder height equals mirror height
//         this.placeholder.style.height = `${this.dragging.originalRect.height}px`;

//         // insert placeholder at computed position
//         if (insertBeforeNode) {
//             cardsContainer.insertBefore(this.placeholder, insertBeforeNode);
//         } else {
//             cardsContainer.appendChild(this.placeholder);
//         }

//         this.currentInsertIndex = insertIndex;
//     }

//     findColumnElement(el) {
//         while (el && !el.classList?.contains('column')) el = el.parentElement;
//         return el;
//     }

//     removePlaceholderFromCurrent() {
//         if (!this.placeholder) return;
//         const p = this.placeholder;
//         if (p.parentElement) p.parentElement.removeChild(p);
//     }

//     onPointerUp(e) {
//         if (!this.dragging) return;
//         // release capture
//         try {
//             const { cardEl } = this.dragging;
//             cardEl.releasePointerCapture(this.dragging.pointerId);
//         } catch (err) { /* ignore */ }

//         // compute destination
//         let destColumnId = null;
//         let destIndex = null;

//         if (this.placeholder && this.placeholder.parentElement) {
//             const parent = this.placeholder.parentElement;
//             const colEl = this.findColumnElement(parent);
//             destColumnId = colEl ? colEl.dataset.columnId : null;
//             // index among cards (count only real cards and placeholders)
//             destIndex = Array.from(parent.children).indexOf(this.placeholder);
//         } else {
//             // if no placeholder, dropping outside — we'll return card to original column at end
//             destColumnId = this.dragging.fromColumnId;
//             destIndex = null;
//         }

//         // perform state update: move card
//         if (destColumnId !== null) {
//             const from = this.dragging.fromColumnId;
//             const to = destColumnId;
//             // if destIndex is null -> append
//             this.boardView.state.board.moveCard(from, to, this.dragging.cardId, destIndex === null ? undefined : destIndex);
//             this.boardView.onChange(this.boardView.state);
//         }

//         // cleanup mirror/placeholder/original element
//         this.cleanupAfterDrop();
//         // re-render board to reflect new state
//         this.boardView.refresh();
//     }

//     cleanupAfterDrop() {
//         // remove mirror
//         if (this.mirror && this.mirror.parentElement) {
//             this.mirror.parentElement.removeChild(this.mirror);
//             this.mirror = null;
//         }
//         // remove placeholder (if it's in DOM we'll remove; original card will be re-rendered)
//         if (this.placeholder && this.placeholder.parentElement) {
//             this.placeholder.parentElement.removeChild(this.placeholder);
//         }
//         this.placeholder = null;

//         // restore original card class in case it's still in DOM
//         if (this.dragging && this.dragging.cardEl) {
//             this.dragging.cardEl.classList.remove('dragging');
//         }
//         this.dragging = null;

//         document.body.classList.remove('dragging');

//         window.removeEventListener('pointermove', this.onPointerMove);
//         window.removeEventListener('pointerup', this.onPointerUp);
//     }
// }





export default class DragManager {
    constructor(boardView) {
        this.boardView = boardView;
        this.dragging = null;
        this.mirror = null;
        this.placeholder = null;
        this.currentTargetColumn = null;
        this.currentInsertIndex = null;

        // binding
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

        // create mirror
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

        // create placeholder
        this.placeholder = document.createElement('div');
        this.placeholder.className = 'placeholder';
        this.placeholder.style.height = `${rect.height}px`;

        // insert placeholder in place of original card
        cardEl.parentNode.insertBefore(this.placeholder, cardEl);
        cardEl.style.display = 'none';
        cardEl.classList.add('dragging');

        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
    }

    onPointerMove(e) {
        if (!this.dragging) return;
        e.preventDefault();

        // move mirror
        const { offsetX, offsetY } = this.dragging;
        this.mirror.style.left = `${e.clientX - offsetX}px`;
        this.mirror.style.top = `${e.clientY - offsetY}px`;

        // find column under pointer
        const elUnder = document.elementFromPoint(e.clientX, e.clientY);
        const columnEl = this.findColumnElement(elUnder);
        if (!columnEl) return;

        const cardsContainer = columnEl.querySelector('.cards');
        if (!cardsContainer) return;

        this.currentTargetColumn = columnEl;

        // find insert index
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

        // update state
        this.boardView.state.board.moveCard(fromColumnId, toColumnId, cardId, insertIndex);
        this.boardView.onChange(this.boardView.state);

        // cleanup
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

        // rerender board
        this.boardView.refresh();
    }
}
