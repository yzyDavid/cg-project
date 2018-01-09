const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// noinspection JSUnresolvedVariable
module.exports = {
    devtool: "cheap-module-source-map",
    entry: __dirname + '/src/index.ts',
    output: {
        path: __dirname + '/build/',
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: __dirname + '/build',
        historyApiFallback: true,
        inline: true
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /(\.tsx|\.ts)$/,
                exclude: /node_module/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ],
            },
            {
                test: /(\.jsx|\.js)$/,
                exclude: /node_module/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                        },
                    },
                ]
            },
            {
                test: /\.png$/,
                use: {
                    loader: 'url-loader?limit=10000&name=img/[name].[ext]'
                }
            },
            {
                test: /\.(vert|frag|geom|mtl|obj)$/,
                use: 'raw-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: 'public/index.html'
        }),
        new CopyWebpackPlugin([
            {
                from: 'assets',
                to: 'assets'
            },
            {
                from: 'root',
                to: ''
            }
        ])
    ]
};
