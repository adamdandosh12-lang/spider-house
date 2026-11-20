// Exercise the same complete story in both languages, including doors and rescue objectives.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),acorn=require('./vendor/acorn.cjs');
const root=path.resolve(__dirname,'..');process.chdir(root);
const catalog=JSON.parse(fs.readFileSync('localization/catalog.json','utf8'));
const translations=new Map(fs.readFileSync('localization/english.txt','utf8').trimEnd().split(/\r?\n/).map(l=>{const i=l.indexOf('|');return[catalog[Number(l.slice(0,i))].text,l.slice(i+1)];}));
const fragments={'מרתף':'Basement','העכביש מצא':'The Spider Found','קפץ':'jumped','התקרה':'ceiling','עכביש ענק':'enormous','השוטרים':'Police','כדי שיהיה אור':'to light your way','כדי לברוח מהבית':'to escape the house','כדי לפתוח את המרתף':'to unlock the basement','סוללת':'Battery','סוללה':'battery','הכנס את כרטיס הגישה':'Insert Your Access Card','דגימה':'sample','הלו':'Hello','תג העובד':'ID badge','בהצלחה בניסוי 8':'Good luck with Experiment 8','נועה':'Noa','אני:':'Adam:','לצאת לתפריט?':'Return to the Menu?'};
let source=fs.readFileSync('tests/runtime.test.mjs','utf8'),edits=[];
for(const t of acorn.tokenizer(source,{ecmaVersion:'latest',sourceType:'module'}))if(t.type.label==='string'&&/[\u0590-\u05ff]/.test(t.value)){
 const value=fragments[t.value]??translations.get(t.value);if(value===undefined)throw Error('Untranslated assertion: '+t.value);edits.push([t.start,t.end,JSON.stringify(value)]);
}
for(const [a,b,v]of edits.reverse())source=source.slice(0,a)+v+source.slice(b);
// English headings use title case; the translated assertions test wording, not capitalization.
source=source.replace(/\.includes\(("(?:[^"\\]|\\.)*")\)/g,(_,s)=>'.toLowerCase().includes('+s+'.toLowerCase())');
source=source.replace("new URL('../dist',import.meta.url)","new URL('../dist/en',import.meta.url)");
source=source.replace("src.replace(/from '(\\.\\/[^']+)'/g", "src.replace(/from '(\\.\\.?\\/[^']+)'/g");
const generated='tests/_english-flow.generated.mjs';fs.writeFileSync(generated,source);
try{const run=cp.spawnSync(process.execPath,[generated],{stdio:'inherit'});process.exitCode=run.status??1;}finally{fs.unlinkSync(generated);}
