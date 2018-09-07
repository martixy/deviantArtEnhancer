//Note: ESM (ES6 modules, i.e. import/export) in config requires using "--config-register esm" param for webpack
import path from 'path'
import fs from 'fs'
import pj2us from 'pj2us-transformer';
import CopyWebpackPlugin from 'copy-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import EventHooksPlugin from 'event-hooks-webpack-plugin'
import webpack from 'webpack'


const defaultConf = {
    name: 'default',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new EventHooksPlugin({ //How ironic is it that CopyWebpackPlugin can't actually copy files? Metric fucktons of irony, that how much.
            compile: () => {
                console.log('Copying config.');
                if (!fs.existsSync(path.resolve(__dirname, 'config/config.json.dist'))) {
                    fs.copyFileSync(
                        path.resolve(__dirname, 'config/config.json.dist'),
                        path.resolve(__dirname, 'config/config.json')
                    )
                } else {
                    console.log('config.json exists, skipping copy.');
                }
                if (!fs.existsSync(path.resolve(__dirname, 'config/filter.json.dist'))) {
                    fs.copyFileSync(
                        path.resolve(__dirname, 'config/filter.json.dist'),
                        path.resolve(__dirname, 'config/filter.json')
                    )
                } else {
                    console.log('filter.json exists, skipping copy.');
                }
            }
        }),
        new CopyWebpackPlugin([
            {
                from: 'package.json',
                to: path.resolve(__dirname, 'dist') + '/local.user.js',
                transform: function(content, resourcePath) {
                    return pj2us(content, path.resolve(__dirname, 'dist/main.js'));
                }
            }
        ], { }),
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery'
        })
    ]
}

export default defaultConf
