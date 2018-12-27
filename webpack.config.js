const webpack = require("webpack");
const isProd = process.env.NODE_ENV === 'production' ? true : false;

module.exports = {
  entry: {
    script: "./src/js/script.js"
  },
  output: {
    path: `${__dirname}/assets/js`, // webpackを直で実行時に参照
		filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                ["env", {
                  "targets": {
                    "browsers": ["last 1 versions"]
                  },
                  "modules": false
                }]
              ]
            }
          }
        ]
      }
    ]
  }
}

if (isProd) {
  module.exports.mode = 'production';
} else {
  module.exports.mode = 'development';
  module.exports.devtool = 'source-map';
}