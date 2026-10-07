const fs = require('fs');
let content = fs.readFileSync('src/LanguageContext.tsx', 'utf8');

const enEndStr = `    "Kullanım Şartları": "Terms of Use",
    "Gizlilik Politikası": "Privacy Policy"
  },`;

const enEndIndex = content.indexOf(enEndStr);
if (enEndIndex !== -1) {
  const cutoffIndex = enEndIndex + enEndStr.length - 1; // pointing to the comma
  const before = content.substring(0, cutoffIndex - 1); // remove comma
  
  const endOfDictStr = `\n};

interface LanguageContextProps {`;
  const endOfDictIndex = content.indexOf(endOfDictStr);
  
  if (endOfDictIndex !== -1) {
    const after = content.substring(endOfDictIndex);
    fs.writeFileSync('src/LanguageContext.tsx', before + after);
    console.log('Successfully trimmed dictionary');
  } else {
    console.log('Could not find end of dictionary');
  }
} else {
  console.log('Could not find enEndStr');
}
