const fs = require('fs');

const files = [
  'src/LanguageContext.tsx',
  'src/pages/HomePage.tsx',
  'src/components/SearchForm.tsx',
  'src/components/AboutSection.tsx'
];

const replacements = [
  { from: /"Tur Destinasyonları"/g, to: '"Tur Rotaları"' },
  { from: /"Destinasyonunuzu Seçin"/g, to: '"Rotanızı Seçin"' },
  { from: /"Destinasyon \/ Gidilecek Yer"/g, to: '"Nereye gitmek istersiniz?"' },
  { from: /"Özel Seçilmiş Destinasyon"/g, to: '"Özel Seçilmiş Rotalar"' },
  { from: />Destinasyon \/ Gidilecek Yer</g, to: '>Nereye gitmek istersiniz?<' },
  { from: />Özel Seçilmiş Destinasyon</g, to: '>Özel Seçilmiş Rotalar<' }
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  fs.writeFileSync(file, content);
});
console.log('Done!');
