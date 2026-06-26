import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.join(__dirname, '..', 'src', 'data', 'modules.ts');
let c = fs.readFileSync(p, 'utf8');
const marker = "\n{\n    id: 4,\n    slug: 'segurados-e-dependentes'";
const start = c.indexOf(marker);
const end = c.indexOf('];\n\n\n// Module Progress delegates');
if (start === -1 || end === -1) {
  console.error('markers not found', { start, end });
  process.exit(1);
}
const before = c.slice(0, start);
const after = c.slice(end);
const replacement = '\n  ...courseModulesExtended,';
fs.writeFileSync(p, before + replacement + after);
console.log('OK. Removed', end - start, 'chars');
