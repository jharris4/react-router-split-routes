import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import node from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
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
  let terserOptions = {
    compress: {
      negate_iife: false
    }
  };
  config.plugins.push(terser(terserOptions));
}

export default config;