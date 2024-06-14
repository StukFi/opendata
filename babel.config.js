import.meta.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true
import.meta.env.VUE_CLI_BABEL_TARGET_NODE = "node"

module.exports = {
    presets: [
        ["@vue/app", { useBuiltIns: "entry" }]
    ]
}
