import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import injectProcessEnv from 'rollup-plugin-inject-process-env'; 


export default {
    input: 'modules/zoom.js',
    output: {
        file: 'public/js/zoom.min.js',
        format: 'umd',
        name: 'Zoom'
    },
    plugins: [
        nodeResolve({
            browser: true
        }),
        commonjs(),
        injectProcessEnv({
            NODE_ENV: process.env.NODE_ENV
        })
    ]
}