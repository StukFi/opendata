module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:vue/recommended",
    ],
    "env": {
        "node": true,
        "jest": true
    },
    "parserOptions": {
        "parser": "babel-eslint"
    },
    "rules": {
        "indent": ["error", 4],
        "vue/html-indent": ["error", 4],
        "quotes": ["error", "double"],
    }
}
