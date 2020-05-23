module.exports = {
    "moduleFileExtensions": ["js", "json", "jsx", "node", "vue"],
    "moduleDirectories": [
        "node_modules",
        "src"
    ],
    "transform": {
        "^.+\\.js$": "babel-jest",
        "^.+\\.vue$": "vue-jest",
        ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub"
    },
    "transformIgnorePatterns": [
        "node_modules/(?!(ol|vuejs-datepicker)/)"
    ],
    "setupFilesAfterEnv": ["@testing-library/jest-dom"],
    "moduleNameMapper": {
        "^@/(.*)$": "<rootDir>/src/$1"
    }
}
