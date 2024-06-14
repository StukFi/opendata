module.exports = {
    "moduleFileExtensions": ["js", "json", "jsx", "node", "vue"],
    "moduleDirectories": [
        "node_modules",
        "src"
    ],
    "transform": {
        "^.+\\.js$": "babel-jest",
        "^.+\\.vue$": "@vue/vue3-jest",
        ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub"
    },
    "transformIgnorePatterns": [
        "node_modules/(?!(ol|vuejs-datepicker)/)",
        '/node_modules/(?!(axios)/)',
    ],
    "setupFilesAfterEnv": ["@testing-library/jest-dom"],
    "moduleNameMapper": {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    "testEnvironment": "jsdom"
}
