import fs from 'fs';
import path from 'path';
import pkg from './package.json';
import scss from 'rollup-plugin-scss';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';

const production = !process.env.ROLLUP_WATCH;
const pkgDir = 'package';
const file = path.join(pkgDir, pkg.module);
const srcMap = file + '.map';
const defFile = file.replace(/\.js$/, '.d.ts');

fs.mkdirSync(path.dirname(file));
exportsAndDefs();

export default [{
    input: 'src/lib/scss.ts',
    plugins: [
        scss({ output: path.join(pkgDir, pkg.style) }),
    ]
},
{
    input: 'src/lib/index.ts',
    output: [
        {
            file,
            format: 'es',
            sourcemap: false,
            inlineDynamicImports: true
        },
    ],
    plugins: [
        svelte({
            compilerOptions: { dev: !production },
            emitCss: false,
            preprocess: sveltePreprocess()
        }),

        resolve({ browser: true }),
        commonjs(),
        json(),
        typescript(),
        getBabelOutputPlugin({ presets: ['@babel/preset-env'] }),
        
        production && terser()
    ]
}];

function exportsAndDefs() {
    const pkgPath = path.join(pkgDir, 'package.json');
    const distPkg = JSON.parse(String(fs.readFileSync(pkgPath)));
    const relativeFile = normalizePath(pkgDir, file);
    const relativeSrcMapPath = normalizePath(pkgDir, srcMap);
    const relativeDefFile = normalizePath(pkgDir, defFile);

    console.info('Include exports', {
        relativeFile,
        relativeSrcMapPath,
        relativeDefFile
    });

    fs.writeFileSync(pkgPath, JSON.stringify({
        ...distPkg,
        exports: {
            ...distPkg.exports,
            [relativeFile]: relativeFile,
            [relativeSrcMapPath]: relativeSrcMapPath,
            [relativeDefFile]: relativeDefFile
        }
    }, null, 2));

    console.info('Create def file', defFile);
    fs.writeFileSync(defFile, `export * from '../index'\n`);
}

function normalizePath(_pkgDir, _file) {
    return './' + path.normalize(path.relative(_pkgDir, _file)).replace('\\', '/');
}
