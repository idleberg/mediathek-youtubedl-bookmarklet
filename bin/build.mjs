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

    await fs.mkdir('./public');
    await fs.writeFile('./public/index.html', output);
})();