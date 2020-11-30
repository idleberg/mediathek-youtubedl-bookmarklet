#!/usr/bin/env node

import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import { render } from 'ejs';
import { minify } from 'terser';

(async () => {
    const bookmarklet = (await fs.readFile(resolve('./src/bookmarklet.js'))).toString();
    const html = (await fs.readFile(resolve('./src/index.ejs'))).toString();

    const { code } = (await minify(bookmarklet));
    const href = `javascript:(function()\{${encodeURI(code)}\})()`;

    const output = render(html, {bookmarklet: href});
    const outFolder = './public';
    const outFile = join(outFolder, 'index.html');

    await fs.rm('./public', {
        force: true,
        recursive: true
    });
    await fs.mkdir('./public');
    await fs.writeFile(outFile, output);
})();