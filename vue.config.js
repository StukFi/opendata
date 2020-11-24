const webpack = require("webpack")
const fs = require("fs")

const packageJSON = fs.readFileSync("./package.json")
const version = JSON.parse(packageJSON).version || 0

module.exports = {
    publicPath: "./",
    productionSourceMap: false,
    lintOnSave: false,
    configureWebpack: {
        devtool: "source-map",
        plugins: [
            new webpack.DefinePlugin({
                "process.env": {
                    APP_VERSION: "'" + version + "'"
                }
            })
        ]
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                    @import "@/assets/styles/variables.scss";
                `
            }
        }
    },
    pluginOptions: {
        i18n: {
            enableInSFC: true
        }
    }
}
