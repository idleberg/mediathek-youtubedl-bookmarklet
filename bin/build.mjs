#!/usr/bin/env node

import { join, resolve } from 'path';
import { minify } from 'terser';
import { minify as htmlMinify } from 'html-minifier-terser';
import { promises as fs } from 'fs';
import { render } from 'ejs';

(async () => {
    const bookmarkletFile = resolve('./src/bookmarklet.js');
    const htmlFile = resolve('./src/index.ejs');
    const faviconFile = resolve('./src/favicon.svg');

    const bookmarklet = (await fs.readFile(bookmarkletFile)).toString();
    const html = (await fs.readFile(htmlFile)).toString();

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
    await fs.copyFile(faviconFile, './public/favicon.svg');
    await fs.writeFile(outFile, output);
})();