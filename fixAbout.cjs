const fs = require('fs');
const file = 'src/LanguageContext.tsx';

let content = fs.readFileSync(file, 'utf8');

const trNewText = 'Profesyonel ekibimiz, ülkemizin dört bir yanındaki eşsiz güzellikleri ve seçkin yurtdışı rotalarını keşfetmeniz için kusursuz deneyimler düzenlemek üzere çalışmaktadır. Tarihi dokuya sahip kültürel gezilerden doğa ile iç içe maceralara kadar her detayı sizin için özenle planlıyoruz.';

content = content.replace(
  /"Profesyonel ekibimiz, ülkemizin dört bir yanındaki eşsiz güzellikleri ve seçkin yurtdışı rotalarını keşfetmeniz için kusursuz deneyimler düzenlemek üzere çalışmaktadır\. Tarihi dokuya sahip kültürel gezilerden doğa ile iç içe maceralara kadar her detayı sizin için özenle planlıyoruz\.": "Profesyonel ekibimiz Güneydoğu Asya, Kuzey Amerika ve Avrupa genelinde kusursuz deneyimler düzenlemek için günün her saati çalışmaktadır\. Butik sahil odalarını ayırtmaktan manzaralı rehberli yürüyüşler tasarlamaya kadar her rezervasyon detayıyla ilgileniyoruz\."/g,
  `"${trNewText}": "${trNewText}"`
);

content = content.replace(
  /"Profesyonel ekibimiz Güneydoğu Asya, Kuzey Amerika ve Avrupa genelinde kusursuz deneyimler düzenlemek için günün her saati çalışmaktadır\. Butik sahil odalarını ayırtmaktan manzaralı rehberli yürüyüşler tasarlamaya kadar her rezervasyon detayıyla ilgileniyoruz\."/g,
  `"${trNewText}"`
);

fs.writeFileSync(file, content);
console.log('Fixed LanguageContext.tsx');
