let buildTime = new Date()
module.exports = {
    publicPath: '/',
    productionSourceMap: false,
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].buildTime = buildTime
                return args
            })
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                // secure: false,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
