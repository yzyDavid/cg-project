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
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: "file-loader"
                }
            },
            {
                test: /\.(woff|woff2)$/,
                use: {
                    loader: "url-loader?prefix=font/&limit=5000"
                }
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: "url-loader?limit=10000&mimetype=application/octet-stream"
                }
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: "url-loader?limit=10000&mimetype=image/svg+xml"
                }
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
            }
        ])
    ]
};
