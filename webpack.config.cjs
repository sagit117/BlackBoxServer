// @ts-ignore
const path = require('path')
const nodeExternals = require('webpack-node-externals');

const mode = process.env.NODE_ENV || 'production'

module.exports = {
    mode: mode,
    entry: "./src/server.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
        clean: false, // очищать сборочный каталог перед новой сборкой
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [

    ],
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
}
