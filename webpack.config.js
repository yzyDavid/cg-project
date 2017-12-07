const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: "cheap-module-source-map",
    entry: __dirname + '/src/index.js',
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
                use: [
                    {
                        loader: 'babel-loader?cacheDirectory',
                        options:
                            {
                                "presets": [
                                    "env"
                                ],
                            }

                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: 'babel-loader',
                    options:
                        {
                            "presets": [
                                "env"
                            ],
                        }
                },
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
                test: /\.(vert|frag|geom)$/,
                use: 'raw-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: 'public/index.html'
        }),
    ]
}