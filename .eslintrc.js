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
    "rules": {
        "indent": ["error", 4],
        "vue/html-indent": ["error", 4],
        "quotes": ["error", "double"],
        "no-trailing-spaces": 2
    },
    "env": {
        "node": true,
        "es2022": true,
    }
}
