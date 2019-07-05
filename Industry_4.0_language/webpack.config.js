module.exports = () => ({
    entry: __dirname + '/index.js',
    output: {
        path: __dirname + '/lib',
        filename: `index.js`
    },
    mode: 'development',
    target: 'node',
    devtool: 'none',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: {
                                        browsers: '> 5%',
                                        node: '6'
                                    }
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    },
    node: {
        fs: 'empty',
        child_process: 'empty',
        path: 'empty'
    }
})