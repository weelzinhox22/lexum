const fs = require('fs');
const path = 'src/pages/ModulePage.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace literal '\\n' (backslash + n) with actual '\n' (newline) in the source code
// The file has: '\\n' which is quote + \\ + n + quote (the JS string literal produces \n literal string)
// We need: '\n' which is quote + newline + quote (the JS string literal produces actual newline)
content = content.split("'\\\\n\\\\n'").join("'\n\n'");
content = content.split("'\\\\n'").join("'\n'");

fs.writeFileSync(path, content, 'utf8');
console.log('Done');
