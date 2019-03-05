module.exports = {
    "moduleFileExtensions": ["js", "json", "jsx", "node", "vue"],
    "moduleDirectories": [
        "node_modules",
        "src"
    ],
    "transform": {
        "^.+\\.js$": "babel-jest",
        "^.+\\.vue$": "vue-jest"
    },
    "transformIgnorePatterns": [
        "node_modules/(?!(ol|vuejs-datepicker)/)"
    ]
}
