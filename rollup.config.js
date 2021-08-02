import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import { name, version, author, license } from './package.json';

export default {
    input: 'src/index.js',
    output: {
        dir: 'dist',
        format: 'cjs',
        exports: 'auto',
        banner: `/*
        * ${name} v${version}
        * (c) 2021-2022 ${author}
        * Released under the ${license} License.
        */`,
    },
    plugins: [json(), terser({
        // compress: {
        //     drop_console: true
        // },
    })]
};