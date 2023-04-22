const path = require('path');

module.exports = {
  entry: './in.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname)
  },
  mode: 'development'
};
