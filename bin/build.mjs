#!/usr/bin/env node

import { join, resolve } from 'path';
import { minify } from 'terser';
import { minify as htmlMinify } from 'html-minifier-terser';
import { promises as fs } from 'fs';
import { render } from 'ejs';

const htmlMinifyOptions = {
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeComments: true
};

(async () => {
    const bookmarkletFile = resolve('./src/bookmarklet.js');
    const htmlFile = resolve('./src/index.ejs');
    const faviconFile = resolve('./src/favicon.svg');

    const bookmarklet = (await fs.readFile(bookmarkletFile)).toString();
    const favicon = (await fs.readFile(faviconFile)).toString();
    const html = (await fs.readFile(htmlFile)).toString();

    const { code } = (await minify(bookmarklet));
    const href = `javascript:(function()\{${encodeURI(code)}\})()`;

    const htmlOutput = await htmlMinify(render(html, {bookmarklet: href}), htmlMinifyOptions);
    const faviconOutput = await htmlMinify(favicon, htmlMinifyOptions);

    const outFolder = './public';
    const faviconOutputFile = join(outFolder, 'favicon.svg');
    const htmlOutputFile = join(outFolder, 'index.html');

    await fs.rm('./public', {
        force: true,
        recursive: true
    });
    await fs.mkdir('./public');
    await fs.writeFile(faviconOutputFile, faviconOutput);
    await fs.writeFile(htmlOutputFile, htmlOutput);
})();