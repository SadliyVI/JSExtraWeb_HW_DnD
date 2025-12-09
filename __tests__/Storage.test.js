import Storage from "../src/core/Storage.js";

describe("Storage", () => {

    beforeEach(() => {
        global.localStorage = {
            store: {},
            getItem(k) { return this.store[k] || null; },
            setItem(k, v) { this.store[k] = v; },
            removeItem(k) { delete this.store[k]; }
        };
    });

    test("save & load works", () => {
        const st = new Storage("x");
        st.save({ a: 1 });
        const res = st.load();
        expect(res).toEqual({ a: 1 });
    });

    test("load returns null if no key", () => {
        const st = new Storage("none");
        expect(st.load()).toBe(null);
    });

});
