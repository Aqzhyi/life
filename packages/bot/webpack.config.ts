import { Configuration } from 'webpack'
import path from 'path'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import Dotenv from 'dotenv-webpack'
import globby from 'globby'
import webpackNodeExternals from 'webpack-node-externals'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

const configration: Configuration = {
  target: 'node',
  externals: [
    webpackNodeExternals({
      modulesFromFile: true,
    }),
  ],
  stats: {
    warnings: false,
  },
  /** TODO: cheap-module-eval-source-map is no suit for production */
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',
  entry: {
    index: path.resolve(__dirname, 'src/index'),
  },
  output: {
    filename: '[name].bundle.js',
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    mainFields: ['main'],
    /**
     * going
     *   @/actions: __dirname + src/actions
     *   @/lib: __dirname + src/lib
     *   ....
     * and so on
     */
    alias: globby
      .sync(['src/*'], {
        expandDirectories: false,
        onlyDirectories: true,
      })
      .reduce((alias, item) => {
        const [, directory] = item.split('/')
        alias[`@/${directory}`] = path.join(__dirname, item)
        return alias
      }, {}),
    extensions: ['.js', '.tsx', '.ts'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        exclude: [/node_modules/],
        loader: 'eslint-loader',
        options: {
          configFile: path.resolve(__dirname, '../../.eslintrc.js'),
        },
        test: /\.tsx?$/,
      },
      {
        exclude: /node_modules/,
        test: /\.tsx?/,
        use: [
          // {
          //   loader: 'swc-loader',
          // },
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv({
      defaults: false,
      systemvars: true,
    }),
    new ForkTsCheckerWebpackPlugin({
      async: true,
      checkSyntacticErrors: true,
      eslint: true,
      formatter: 'codeframe',
      ignoreLintWarnings: true,
      memoryLimit: 4096,
      reportFiles: ['src/**/*.{ts,tsx}'],
      silent: false,
    }),
  ],
}

export default configration
