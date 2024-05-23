const path = require('path');

module.exports = {
  entry: './src/index.ts', // 入口文件
  output: {
    filename: 'index.js', // 输出文件名
    path: path.resolve(__dirname, 'dist'), // 输出路径
  },
  resolve: {
    extensions: ['.ts', '.js'], // 可解析的文件扩展名
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader', // 使用ts-loader处理TypeScript文件
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production', // 模式，development 或 production
};