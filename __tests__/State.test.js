import State from "../src/core/State.js";
import Board from "../src/models/Board.js";

describe("State", () => {

    test("empty state loads null board", () => {
        const st = new State(null);
        expect(st.board).toBe(null);
    });

    test("loads board from JSON", () => {
        const raw = {
            board: {
                title: "X",
                columns: [
                    { id: "c1", title: "A", cards: [] }
                ]
            }
        };
        const st = new State(raw);
        expect(st.board instanceof Board).toBe(true);
        expect(st.board.columns.length).toBe(1);
    });

    test("serialize works", () => {
        const st = new State(null);
        st.setBoard(new Board("B", []));
        const ser = st.serialize();
        expect(ser.board.title).toBe("B");
    });

});
