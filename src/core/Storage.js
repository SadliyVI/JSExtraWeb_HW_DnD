export default class Storage {
    constructor(key) {
        this.key = key;
    }
    load() {
        try {
            const raw = localStorage.getItem(this.key);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error('Failed to parse storage', e);
            return null;
        }
    }
    save(payload) {
        try {
            localStorage.setItem(this.key, JSON.stringify(payload));
        } catch (e) {
            console.error('Failed to save storage', e);
        }
    }
}


