const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'modules.ts');
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// ── Step 1: Find key positions ──
const courseModStart = content.indexOf('export const courseModules: CourseModuleData[] = [\n');
const arrayStart = content.indexOf('{\n    id: 1,\n', courseModStart);
const mod4Pos = content.indexOf('\n  {\n    id: 4,\n    slug', arrayStart);
const courseEnd = content.indexOf('];\n\n// Module Progress delegates', arrayStart);

console.log('courseModStart:', courseModStart);
console.log('arrayStart:', arrayStart);
console.log('mod4Pos:', mod4Pos);
console.log('courseEnd:', courseEnd);

// ── Step 2: Extract the corrupted Module 1 (which has Module 3's new content) ──
const corruptedMod1 = content.substring(arrayStart, mod4Pos);
console.log('corruptedMod1 length:', corruptedMod1.length);
console.log('First 100 chars:', corruptedMod1.substring(0, 100));

// ── Step 3: Save everything before courseModules ──
const beforeCourseMods = content.substring(0, courseModStart);

// ── Step 4: Save Modules 4-12 ──
const modules4to12 = content.substring(mod4Pos, courseEnd + 1); // include ];
console.log('modules4-12 length:', modules4to12.length);

// ── Step 5: Save everything after courseModules ──
const afterCourseMods = content.substring(courseEnd + 1);

// ── Step 6: Now extract Module 1 original from the first read_files ──
// I need to find it from a separate source. Let me check if there's a backup file
const bakPath = path.join(__dirname, 'src', 'data', 'modules.ts.bak');
let mod1Original = '';
let mod2Original = '';

// Try reading from backup file if it exists
try {
  const bakContent = fs.readFileSync(bakPath, 'utf8').replace(/\r\n/g, '\n');
  const bakCourseStart = bakContent.indexOf('export const courseModules: CourseModuleData[] = [\n');
  const bakArrayStart = bakContent.indexOf('{\n    id: 1,\n', bakCourseStart);
  const bakMod2Start = bakContent.indexOf('\n  {\n    id: 2,\n', bakArrayStart);
  const bakMod3Start = bakContent.indexOf('\n  {\n    id: 3,\n', bakArrayStart);
  
  mod1Original = bakContent.substring(bakArrayStart, bakMod2Start);
  mod2Original = bakContent.substring(bakMod2Start, bakMod3Start);
  console.log('✅ Found backup file!');
  console.log('mod1Original length:', mod1Original.length);
  console.log('mod2Original length:', mod2Original.length);
} catch (e) {
  console.log('No backup file found');
}

// If no backup, we need to extract from the conversation output
// which we can't do programmatically. Fall back to error.
if (!mod1Original || !mod2Original) {
  console.log('Creating backup of current file for future reference...');
  fs.writeFileSync(filePath + '.bak', content.replace(/\n/g, '\r\n'), 'utf8');
  console.log('Backup saved to modules.ts.bak');
  
  // We need to write a separate script that extracts from this backup and the conversation
  // For now, save info about what we have
  console.log('\n=== Parsing report ===');
  console.log('Corrupted module 1 saved as mod3_new_content');
  console.log('Modules 4-12 saved');
  console.log('Need to inject: MOD1_ORIG + MOD2_ORIG + MOD3_NEW + MODS4_12');
  
  // Save the corrupted mod1 as the new Module 3
  const mod3New = corruptedMod1;
  
  // Now I need to manually provide Module 1 and Module 2 from the conversation
  // Let's write them to backup files for a follow-up script
  fs.writeFileSync(path.join(__dirname, 'tmp_mod3_new.txt'), mod3New, 'utf8');
  fs.writeFileSync(path.join(__dirname, 'tmp_mods4_12.txt'), modules4to12, 'utf8');
  fs.writeFileSync(path.join(__dirname, 'tmp_before_course.txt'), beforeCourseMods, 'utf8');
  
  console.log('\nSaved temp files:');
  console.log('- tmp_mod3_new.txt (Module 3 new content)');
  console.log('- tmp_mods4_12.txt (Modules 4-12)');
  console.log('- tmp_before_course.txt (everything before courseModules)');
  
  process.exit(1);
}

// ── Step 7: Rebuild ──
const rebuilt = beforeCourseMods + 'export const courseModules: CourseModuleData[] = [\n' + 
  mod1Original.trim() + ',\n' +
  mod2Original.trim() + ',\n' +
  corruptedMod1.trim() + ',\n' +
  // The corruptedMod1 ends before mod4Pos, so modules4to12 starts with mod4
  // We need to make sure there's no extra comma issue
  modules4to12.substring(0); // includes the \n  },\n or \n  {\n before id:4

console.log('Rebuilt length:', rebuilt.length);
console.log('Final 200 chars:', rebuilt.substring(rebuilt.length - 200));

// ── Step 8: Convert back to CRLF and write ──
fs.writeFileSync(filePath, rebuilt.replace(/\n/g, '\r\n'), 'utf8');
console.log('✅ File rebuilt successfully!');

// ── Verify ──
const verifyContent = fs.readFileSync(filePath, 'utf8');
const sectionCount = (verifyContent.match(/sections: \[/g) || []).length;
console.log('Number of modules with sections array:', sectionCount);

// Verify module 1 has correct content
const mod1InVerify = verifyContent.indexOf("Histórico da Previdência no Mundo e no Brasil");
if (mod1InVerify > 0) {
  console.log('✅ Module 1 restored correctly');
} else {
  console.error('❌ Module 1 not restored correctly!');
}

// Verify module 2 exists
const mod2InVerify = verifyContent.indexOf("Conceito, Características e Fundamentos do RGPS");
if (mod2InVerify > 0) {
  console.log('✅ Module 2 preserved correctly');
} else {
  console.error('❌ Module 2 not found!');
}

// Verify module 3 has new content
const mod3InVerify = verifyContent.indexOf("Manutenção da Qualidade de Segurado");
if (mod3InVerify > 0) {
  console.log('✅ Module 3 has new content');
}

// Verify module 4 exists
const mod4InVerify = verifyContent.indexOf('Segurados e Dependentes');
if (mod4InVerify > 0) {
  console.log('✅ Module 4 preserved');
}

// Check quiz counts
let mod3Start = verifyContent.indexOf("id: 3,\n    slug: 'qualidade-de-segurado-e-carencia'");
let mod3End = verifyContent.indexOf("id: 4,", mod3Start + 100);
const mod3Portion = verifyContent.substring(mod3Start, mod3End);
const quizCount = mod3Portion.split("question: '").length - 1;
console.log(`✅ Module 3 has ${quizCount} quiz questions`);
