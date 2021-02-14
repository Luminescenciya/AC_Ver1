const CompressionWebpackPlugin = require("compression-webpack-plugin");
module.exports = {
    runtimeCompiler: true,
    lintOnSave:false,
    configureWebpack: {
      devtool: 'source-map',
      plugins: [
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.(js|css)$/
  
        })
      ]
    }
  }