import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: "./src/index.js",

    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "",        // важно для GitHub Pages
        clean: true,
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpg|jpeg|svg)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/[name][ext]",
                },
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],

    devServer: {
        static: path.resolve(__dirname, "dist"),
        port: 8080,
        open: true,
        hot: true,
    },

    mode: "development",
};