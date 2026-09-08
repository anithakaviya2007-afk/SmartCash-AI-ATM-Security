const fs = require('fs');
let content = fs.readFileSync('src/views/AtmMapView.tsx', 'utf-8');

content = content.replace('const minLat = 9.8;', 'const minLat = 8.5;');

fs.writeFileSync('src/views/AtmMapView.tsx', content);
console.log('updated Bounds');
