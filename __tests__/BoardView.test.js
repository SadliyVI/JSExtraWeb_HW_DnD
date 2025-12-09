import BoardView from "../src/ui/BoardView.js";
import Board from "../src/models/Board.js";
import State from "../src/core/State.js";

describe("BoardView (render logic)", () => {

    test("render() creates columns", () => {
        const state = new State(null);
        state.setBoard(new Board("B", [
            { id: "c1", title: "A", cards: [] },
            { id: "c2", title: "B", cards: [] }
        ]));

        const root = {
            innerHTML: "",
            append() { },
            querySelector: () => null,
            contains: () => false
        };

        const view = new BoardView(state, () => { });
        view.render(root);
        expect(view.root).toBe(root);
    });

});
