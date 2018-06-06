const path = require('path');

module.exports={
  // 打包模式
  mode: 'production',
  //入口文件的配置项
  entry:{
    entry: './src/index.js'
  },
  //控制台报错信息，生产环境一定要注释掉！
  // devtool: 'inline-source-map',
  //出口文件的配置项
  output:{
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  }
}