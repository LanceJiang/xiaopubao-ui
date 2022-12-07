const path = require('path')

module.exports = {
  devServer: {
    port: 7777
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    },
    sourceMap: true
  },
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'xiaopubao-ui'
    }
  },
  /* module: {
    rules: [{
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader'
          // .use('style-loader')
          // .loader('style-loader')
        },
        {
          loader: 'css-loader'
          // options: {
          //   importLoaders: 2
          // }
        },
        {
          loader: 'less-loader',
          options: {
            // lessOptions: {
            //   javascriptEnabled: true
            // }
            javascriptEnabled: true
          }
        }
      ]
    }]
  }, */
  chainWebpack: config => {
    // vue默认@指向src目录，这里要修正为examples，另外新增一个~指向packages
    config.resolve.alias
      .set('xiaopubao-ui', path.resolve(''))
      .set('@', path.resolve('examples'))

    // todo set ant-vue less options todo...

    // packages和examples目录需要加入编译
    config.module
      .rule('js')
      .include.add(/packages/).end()
      .include.add(/examples/).end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options
      }).end()

    /* // 配置 less
    config.module
      .rule('less')
      .test(/\.less/)
      .use('style-loader')
      .loader('style-loader')
      .end()
      .use('css-loader')
      .loader('css-loader')
      .end()
      .use('less-loader')
      .loader('less-loader')
      .options({
        javascriptEnabled: true,
        lessOptions: {
          javascriptEnabled: true
        }
      }).end() */
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, 'examples/assets/css/variables.less'),
        path.resolve(__dirname, 'style/variables.less')
      ]
    }
  }
}
