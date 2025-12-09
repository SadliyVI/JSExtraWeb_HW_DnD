module.exports = {
    testEnvironment: "jsdom",

    transform: {
        "^.+\\.js$": "babel-jest",
    },

    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
        "\\.(png|jpg|jpeg|gif|svg|wav)$": "<rootDir>/__mocks__/fileMock.js",
    },

    moduleFileExtensions: ['js', 'json'],

    transformIgnorePatterns: ["/node_modules/"],

    roots: ["<rootDir>/__tests__", "<rootDir>/src"],
};
