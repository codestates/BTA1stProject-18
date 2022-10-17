var path = require('path');
var nodeExternals = require('webpack-node-externals');


module.exports = function (env) {
    return [

        {

            mode: 'development',
            target: 'node',
            devtool: '#source-map',
            node: {
                __dirname: true,
                __filename: true,
            },
            entry: {

                'index': './src/index.js',

            },
            output: {
                libraryTarget: 'commonjs2',
                path: path.join(__dirname, './dist'),
                filename: '[name].js',

            },
            module: {
                rules: [

                    {
                        test: /\.js$/,
                        loader: 'babel-loader',
                        //exclude: /node_modules/
                    },

                ]
            },

            externals: [nodeExternals()],

            plugins:[]

        },


    ]
}
