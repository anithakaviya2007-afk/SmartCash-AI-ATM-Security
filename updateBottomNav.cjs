const fs = require('fs');
let content = fs.readFileSync('src/components/BottomNav.tsx', 'utf-8');

const navItemsOriginal = `    {
      id: 'ATM_MAP',
      label: language === 'ta' ? 'ATM' : 'ATM',
      icon: <MapPin className="h-5 w-5 text-emerald-400" />
    },`;

const navItemsNew = `    {
      id: 'ATM_MAP',
      label: language === 'ta' ? 'ATM' : 'ATM',
      icon: <MapPin className="h-5 w-5 text-emerald-400" />
    },
    {
      id: 'REFILL_TEAMS',
      label: language === 'ta' ? 'வாகனங்கள்' : 'Vans',
      icon: <Truck className="h-5 w-5 text-teal-400" />
    },`;

content = content.replace(navItemsOriginal, navItemsNew);
fs.writeFileSync('src/components/BottomNav.tsx', content);
console.log('updated BottomNav');
