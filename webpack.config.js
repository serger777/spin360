const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const cssNano = require("cssnano");


const NODE_ENV = process.env.NODE_ENV;


module.exports = {
    mode: NODE_ENV == "development" ?  'development': "production",
    watch: NODE_ENV == "development" ?  true : false,
    entry: './src/index.js',
    output: {
        path:__dirname+"/build"
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false,
        }),

    ],
    module: {
        rules: [
            {
                test: /\.(m?j|t)s$/,
                exclude: /node_modules/,
                use:{
                    loader:'babel-loader',
                    options:{
                        "presets":["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.(styl|css)?$/,
                use:[
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            // minimize: true,
                            // importLoaders: 2,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer(),
                                cssNano()
                            ]
                        }
                    },
                    {
                        loader: 'stylus-loader',
                        options: {
                            sourceMap: true,
                            preferPathResolver: 'webpack'
                        }
                    }
                ]


            }
        ]

    },

};