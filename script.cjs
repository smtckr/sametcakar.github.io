const fs = require('fs');

const files = [
  'src/components/Footer.tsx',
  'src/LanguageContext.tsx',
  'src/data.ts'
];

const replacements = [
  { from: /destinasyonları/g, to: 'rotaları' },
  { from: /destinasyonlar/g, to: 'rotalar' },
  { from: /Destinasyonları/g, to: 'Rotaları' },
  { from: /Destinasyonlar/g, to: 'Rotalar' }
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  fs.writeFileSync(file, content);
});
console.log('Done!');
