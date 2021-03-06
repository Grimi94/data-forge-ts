const path = require("path");
const    nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist", "node"),
        filename: "index.js",
        libraryTarget: "commonjs2",
    },

    target: "node",
    externals: [ nodeExternals() ], // Ignore all modules in node_modules folder.
    mode: "production",
    devtool: "source-map",

    resolve: {
        extensions: [ ".tsx", ".ts", ".js" ],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },

};