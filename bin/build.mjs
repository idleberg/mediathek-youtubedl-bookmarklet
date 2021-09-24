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
    const input = {
        bookmarklet: resolve('./src/bookmarklet.js'),
        template: resolve('./src/template.ejs'),
        favicon: resolve('./src/favicon.svg')
    };

    // Read files
    const contents = {
        bookmarklet: (await fs.readFile(input.bookmarklet)).toString(),
        favicon: (await fs.readFile(input.favicon)).toString(),
        html: (await fs.readFile(input.template)).toString()
    };

    const { code } = (await minify(contents.bookmarklet));
    const href = `javascript:(function()\{${encodeURI(code)}\})()`;

    // Minify files
    const minified = {
        html: await htmlMinify(render(contents.html, {bookmarklet: href}), htmlMinifyOptions),
        favicon: await htmlMinify(contents.favicon, {
            ...htmlMinifyOptions,
            removeAttributeQuotes: false
        })
    };

    const outFolder = './public';

    const output = {
        favicon: join(outFolder, 'favicon.svg'),
        html: join(outFolder, 'index.html')
    };

    // Clean up
    await fs.rm(outFolder, {
        force: true,
        recursive: true
    });

    // Write output
    await fs.mkdir(outFolder);
    await fs.writeFile(output.favicon, minified.favicon);
    await fs.writeFile(output.html, minified.html);
})();