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
                target: 'http://127.0.0.1:5001',
                changeOrigin: true,
                // secure: false,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
