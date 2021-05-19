const path = require('path')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
 const htlWebpackPlugin = require("html-webpack-plugin")
 const {CleanWebpackPlugin} =require ("clean-webpack-plugin")
 const CopyWebpackPlugin = require('copy-webpack-plugin')

 let mode = "development"


module.exports = {
    mode,
    devtool: "source-map",
    entry: {
        main: path.resolve(__dirname, './src/app.js'),
    },

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
        assetModuleFilename:"img/[hash][ext]"
    },
    devServer: {
        contentBase: './dist',
        open: true,
    },
    module: {
        rules: [
            // изображения
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset',
            },
            // шрифты и SVG
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.s?css$/i,
                use: [{
                        loader: miniCssExtractPlugin.loader,
                        options: { publicPath: ""},
                    },
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: "asset"
            }

        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new miniCssExtractPlugin(),
        new htlWebpackPlugin({
            template:"./src/index.html"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "./static" }
            ]
        }),
    ]
}


