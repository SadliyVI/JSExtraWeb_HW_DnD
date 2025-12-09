import Column from "../src/models/Column.js";
import Card from "../src/models/Card.js";

describe("Column", () => {

    test("column loads cards", () => {
        const col = new Column("col1", "ToDo", [{ id: "a", text: "one" }]);
        expect(col.cards.length).toBe(1);
        expect(col.cards[0] instanceof Card).toBe(true);
    });

    test("addCard appends if index == null", () => {
        const col = new Column("c", "x");
        col.addCard(new Card("1", "test"));
        expect(col.cards.length).toBe(1);
    });

    test("addCard inserts at index", () => {
        const col = new Column("c", "x", [
            new Card("1", "a"),
            new Card("2", "b")
        ]);
        col.addCard(new Card("3", "c"), 1);
        expect(col.cards.map(c => c.id)).toEqual(["1", "3", "2"]);
    });

    test("removeCardById removes correct item", () => {
        const col = new Column("c", "x", [
            new Card("1", "a"),
            new Card("2", "b")
        ]);
        col.removeCardById("1");
        expect(col.cards.length).toBe(1);
        expect(col.cards[0].id).toBe("2");
    });

    test("serializes correctly", () => {
        const col = new Column("c1", "Test", [
            new Card("1", "AAA")
        ]);
        expect(col.toJSON()).toEqual({
            id: "c1",
            title: "Test",
            cards: [{ id: "1", text: "AAA" }]
        });
    });

});
