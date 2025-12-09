import Card from "../src/models/Card.js";

describe("Card", () => {

    test("Card creates with id & text", () => {
        const c = new Card("1", "hello");
        expect(c.id).toBe("1");
        expect(c.text).toBe("hello");
    });

    test("Card serializes to JSON", () => {
        const c = new Card("1", "test");
        expect(c.toJSON()).toEqual({ id: "1", text: "test" });
    });

    test("Card.fromJSON loads correctly", () => {
        const src = { id: "abc", text: "zzz" };
        const c = Card.fromJSON(src);
        expect(c.id).toBe("abc");
        expect(c.text).toBe("zzz");
    });

});
