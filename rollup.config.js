// import typescript from '@rollup/plugin-typescript';
// import run from '@rollup/plugin-run';
// import commonjs from '@rollup/plugin-commonjs';
// import json from '@rollup/plugin-json';

export default {
    input: 'src/index.js',
    output: {
        dir: 'dist',
        format: 'cjs',
        exports: 'auto'
    },
    // plugins: [commonjs()]
};