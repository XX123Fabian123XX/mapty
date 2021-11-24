const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry:{
        main:"./src/js/index.js",
    },
    plugins:[new HtmlWebpackPlugin({
        template:"./src/template.html",
        favicon: './src/assets/favicon.png',
    })],
    module: {
        rules:[
            {
                test:/\.html$/,
                use:["html-loader"]
            },
            {
                test:/\.(svg|png|jpg|gif)$/,
                use:{
                    loader:"file-loader",
                    options:{
                        name:"[name].[hash].[ext]",
                        outputPath:"imgs"
                    }
                }
            }
        ]
    }
}



