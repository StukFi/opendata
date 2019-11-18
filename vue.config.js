module.exports = {
    publicPath: "./",
    productionSourceMap: false,
    configureWebpack: {
        devtool: "source-map"
    },
    pluginOptions: {
        i18n: {
            enableInSFC: true
        }
    }
}
