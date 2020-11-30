#!/usr/bin/env node

import { join, resolve } from 'path';
import { minify } from 'terser';
import { minify as htmlMinify } from 'html-minifier-terser';
import { promises as fs } from 'fs';
import { render } from 'ejs';

(async () => {
    const bookmarklet = (await fs.readFile(resolve('./src/bookmarklet.js'))).toString();
    const html = (await fs.readFile(resolve('./src/index.ejs'))).toString();

    const { code } = (await minify(bookmarklet));
    const href = `javascript:(function()\{${encodeURI(code)}\})()`;

    const output = await htmlMinify(render(html, {bookmarklet: href}), {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
    });
    const outFolder = './public';
    const outFile = join(outFolder, 'index.html');

    await fs.rm('./public', {
        force: true,
        recursive: true
    });
    await fs.mkdir('./public');
    await fs.writeFile(outFile, output);
})();