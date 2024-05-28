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
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),

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
    },
    chainWebpack: (config) => {
        config.resolve.alias.set('vue', '@vue/compat')
    
        config.module
          .rule('vue')
          .use('vue-loader')
          .tap((options) => {
            return {
              ...options,
              compilerOptions: {
                compatConfig: {
                  MODE: 2
                }
              }
            }
          })
      }
}