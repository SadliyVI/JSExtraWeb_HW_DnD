import Board from '../models/Board.js';

export default class State {
    constructor(raw = null) {
        if (raw) {
            this.board = Board.fromJSON(raw.board);
        } else {
            this.board = null;
        }
    }

    setBoard(board) {
        this.board = board;
    }

    serialize() {
        return {
            board: this.board ? this.board.toJSON() : null
        };
    }
}
