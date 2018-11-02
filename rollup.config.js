import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import node from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import rollupAnalyzer from 'rollup-analyzer-plugin';
const isMinified = process.env.BABEL_ENV === 'min';

let pkg = require('./package.json');
const outputFile = isMinified ? 'dist/react-router-split-routes.min.js' : 'dist/react-router-split-routes.js';

let externalPackages = pkg.vendorize;
let globalPackages = pkg.globalize;

let config = {
  input: 'src/index.js',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    node(),
    commonjs()
  ],
  external: externalPackages,
  output: [{
    name: 'ReactRouterSplitRoutes',
    format: 'umd',
    file: outputFile,
    sourcemap: true,
    globals: globalPackages
  }],
};

if (isMinified) {
  let uglifyOptions = {
    compress: {
      negate_iife: false
    }
  };
  config.plugins.push(uglify(uglifyOptions));
}

// config.plugins.push(
//   rollupAnalyzer({
//     limit: 10,
//     //filter: [],
//     //root: __dirname
//   })
// );

export default config;