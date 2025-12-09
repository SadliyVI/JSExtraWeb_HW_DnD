import Board from "../src/models/Board.js";
import Column from "../src/models/Column.js";
import Card from "../src/models/Card.js";

describe("Board", () => {

    test("board loads columns", () => {
        const board = new Board("My", [
            { id: "c1", title: "A", cards: [] }
        ]);
        expect(board.columns[0] instanceof Column).toBe(true);
    });

    test("createCard adds card to column", () => {
        const board = new Board("B", [
            { id: "c1", title: "A", cards: [] }
        ]);
        const newCard = board.createCard("c1", "task1");
        expect(board.getColumnById("c1").cards.length).toBe(1);
        expect(newCard.text).toBe("task1");
    });

    test("moveCard moves between columns", () => {
        const board = new Board("B", [
            { id: "c1", title: "A", cards: [{ id: "t1", text: "text" }] },
            { id: "c2", title: "B", cards: [] }
        ]);

        board.moveCard("c1", "c2", "t1", 0);

        expect(board.getColumnById("c1").cards.length).toBe(0);
        expect(board.getColumnById("c2").cards.length).toBe(1);
        expect(board.getColumnById("c2").cards[0].id).toBe("t1");
    });

    test("removeCard removes a card", () => {
        const board = new Board("B", [
            { id: "c1", title: "A", cards: [{ id: "1", text: "x" }] }
        ]);

        board.removeCard("c1", "1");
        expect(board.getColumnById("c1").cards.length).toBe(0);
    });

});
