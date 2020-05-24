const _ = require("lodash");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const pages = ["counter"];

module.exports = {
	mode: "development",
	entry: "./src/index.js",
	devtool: "inline-source-map",
	devServer: {
		contentBase: "./dist",
		hot: true,
	},
	plugins: [
		...pages.map(
			(p, i) =>
				new HtmlWebpackPlugin({
					filename: `${p}.html`,
					title: p.toUpperCase(),
					template: `src/${p}.html`,
					pages,
				})
		),
				new HtmlWebpackPlugin({
					// index
					title: 'Seven GUIs',
					template: `src/${pages[0]}.html`,
					pages,
				}),
		new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
	],
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
};
