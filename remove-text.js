const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const regex = /\s*<div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">[\s\S]*?<\/div>/g;
html = html.replace(regex, '');
fs.writeFileSync('index.html', html);
console.log('done');
