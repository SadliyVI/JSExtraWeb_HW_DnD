import Storage from './core/Storage.js';
import State from './core/State.js';
import Board from './models/Board.js';
import BoardView from './ui/BoardView.js';


const STORAGE_KEY = 'kanban-state-v1';

const App = {
    init(root) {
        const storage = new Storage(STORAGE_KEY);
        const raw = storage.load();
        const state = new State(raw);
        if (!state.board) {
            const board = new Board('Board', [
                { id: 'col-1', title: 'To do', cards: [] },
                { id: 'col-2', title: 'In progress', cards: [] },
                { id: 'col-3', title: 'Done', cards: [] }
            ]);
            state.setBoard(board);
            storage.save(state.serialize());
        }
        const boardView = new BoardView(state, (newState) => {
            storage.save(newState.serialize());
        });
        boardView.render(root);
    }
};

export default App;
