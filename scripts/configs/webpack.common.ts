// import CaseSensitivePathsWebpackPlugin from 'case-sensitive-paths-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Options as HtmlMinifierOptions } from 'html-minifier'
import {__DEV__, PROJECT_ROOT, PROJECT_NAME, RESOLVE_PATH } from '../utils/constants';

const htmlMinifyOptions:HtmlMinifierOptions  = {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    useShortDoctype: true,
};


const commonConfig: Configuration = {
    context: PROJECT_ROOT,
    entry: RESOLVE_PATH('./src/index.tsx'),
    output: {
        publicPath: '/',
        path: RESOLVE_PATH('./dist'),
        filename: 'js/[name]-[hash].bundle.js',
        // 加盐 hash
        hashSalt: PROJECT_NAME || 'react typescript boilerplate',
    },
    resolve: {
        // 我们导入ts 等模块一般不写后缀名，webpack 会尝试使用这个数组提供的后缀名去导入
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    module: {
        rules: [
            {
                // 导入 jsx 的人少喝点
                test: /\.(tsx?|js)$/,
                loader: 'babel-loader',
                // 开启缓存
                options: { cacheDirectory: true },
                exclude: /node_modules/,
            },
        ],
    },
    plugins:[
        new HtmlWebpackPlugin({
            // HtmlWebpackPlugin 会调用 HtmlMinifier 对 HTMl 文件进行压缩
            // 只在生产环境压缩
            minify: __DEV__ ? false : htmlMinifyOptions,
            // 指定 html 模板路径
            template: RESOLVE_PATH('./public/index.html'),
            // 类型不好定义，any 一时爽...
            // 定义一些可以在模板中访问的模板参数
            templateParameters: (...args: any[]) => {
                const [compilation, assets, assetTags, options] = args;
                const rawPublicPath = commonConfig.output!.publicPath!;
                return {
                    compilation,
                    webpackConfig: compilation.options,
                    htmlWebpackPlugin: {
                        tags: assetTags,
                        files: assets,
                        options,
                    },
        			// 除掉 publicPath 的反斜杠，让用户在模板中拼接路径更自然
                    PUBLIC_PATH: rawPublicPath.endsWith('/')
                        ? rawPublicPath.slice(0, -1)
                        : rawPublicPath,
                };
            },
        }),
        new WebpackBar({
            name:'react-demo',
            color:'#6cf'
        }),
        new FriendlyErrorsWebpackPlugin(),
        new CleanWebpackPlugin(), // 清理上次打包的bundle

        // new CaseSensitivePathsWebpackPlugin() //路径大小写
    ]
};