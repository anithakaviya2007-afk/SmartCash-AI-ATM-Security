const fs = require('fs');
let content = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');

const targetStr = `        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {atms.map((atm) => {`;

const newStr = `        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...atms].sort((a,b) => a.cashLevel - b.cashLevel).slice(0, 8).map((atm) => {`;

content = content.replace(targetStr, newStr);
fs.writeFileSync('src/views/DashboardView.tsx', content);
console.log('updated Dashboard');
