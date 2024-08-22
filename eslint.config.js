import js from "@eslint/js"
import eslintPluginVue from "eslint-plugin-vue"

export default [
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "indent": ["error", 4],
      "vue/html-indent": ["error", 4],
      "quotes": ["error", "double"],
      "no-trailing-spaces": 2,
      "semi": [2, "never"]
    }
  },
  ...eslintPluginVue.configs["flat/recommended"],
  {
    files: ["*.vue", "**/*.vue"],
    rules: {
      "no-unused-vars": "warn",
      "vue/no-mutating-props": "warn",
      "vue/multi-word-component-names": "warn",
      "indent": ["error", 4],
      "vue/html-indent": ["error", 4],
      "quotes": ["error", "double"],
      "no-trailing-spaces": 2,
      "semi": [2, "never"]
    },
  },
]