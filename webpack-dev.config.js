const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports =  {
    devtool: "source-map",
    devServer:  {
        contentBase: path.join(__dirname, 'static'),
        proxy: {
            '/api': 'http://localhost:5000'
        }
    },
    mode: 'development',
    entry: {
        build: [
            './static/js/index.js',
            'babel-polyfill',
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'static/build'),
        publicPath: "/"
    },
    watch: true,
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new WebpackNotifierPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        limit: 50000,
                        outputPath: 'fonts/',
                    }
                },

            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};
