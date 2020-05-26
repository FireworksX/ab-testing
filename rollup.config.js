import typescript from 'rollup-plugin-typescript';
import uglify from "rollup-plugin-uglify-es";
import commonjs from "rollup-plugin-commonjs";
import cleaner from 'rollup-plugin-cleaner';

const isProduction = !!process.env.production;

const PROJECT_NAME = 'ABTest'

const plugins = [
    typescript(),
    commonjs()
];

if (isProduction) {
    plugins.push(
        cleaner({
            targets: [
                './dist/'
            ]
        }),
        uglify()
    );
}

export default {
    input: './src/index.ts',
    output: [
        {
            file: `dist/${PROJECT_NAME}.cjs.js`,
            format: 'cjs',
            name: PROJECT_NAME
        },
        {
            file: `dist/${PROJECT_NAME}.umd.js`,
            format: 'umd',
            name: PROJECT_NAME
        },
        {
            file: `dist/${PROJECT_NAME}.amd.js`,
            format: 'amd',
            name: PROJECT_NAME
        },
        {
            file: `dist/${PROJECT_NAME}.esm.js`,
            format: 'esm',
            name: PROJECT_NAME
        },
    ],
    plugins
}
