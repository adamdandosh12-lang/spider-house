const fs=require('node:fs'),path=require('node:path'),acorn=require('./vendor/acorn.cjs');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'localization/catalog.json'),'utf8'));
const lines=fs.readFileSync(path.join(root,'localization/english.txt'),'utf8').trimEnd().split(/\r?\n/);
const translations=new Map();const ids=new Set();
for(const line of lines){const at=line.indexOf('|'),id=Number(line.slice(0,at));if(at<1||ids.has(id)||!catalog[id])throw Error('Invalid translation ID: '+line);ids.add(id);translations.set(catalog[id].text,line.slice(at+1));}
if(ids.size!==catalog.length)throw Error('Missing translations');
const names={'נועה':'Noa','אמיר':'Amir','מאיה':'Maya','יואב':'Yoav','רובוט':'Robot','אסף':'Asaf','אברי':'Avri'};
fs.mkdirSync(path.join(dist,'en'),{recursive:true});
function translate(source,file){const edits=[];for(const t of acorn.tokenizer(source,{ecmaVersion:'latest',sourceType:'module'})){
 if(['string','template'].includes(t.type.label)&&/[\u0590-\u05ff]/.test(t.value)){
  if(!translations.has(t.value))throw Error('Untranslated '+file+': '+t.value);
  const english=translations.get(t.value);const value=t.type.label==='string'?JSON.stringify(english):english.replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\$\{/g,'\\${').replace(/\n/g,'\\n');
  edits.push([t.start,t.end,value]);
 }else if(t.type.label==='regexp'){
  let value=source.slice(t.start,t.end);for(const [he,en]of Object.entries(names))value=value.replaceAll(he,en);
  value=value.replace('/^he(?:','/^en(?:');if(value!==source.slice(t.start,t.end))edits.push([t.start,t.end,value]);
 }}for(const [a,b,v]of edits.reverse())source=source.slice(0,a)+v+source.slice(b);
 return source.replaceAll("'./vendor/","'../vendor/").replaceAll('"./vendor/','"../vendor/').replace(/(['"])(\.\/)?assets\//g,'$1../assets/').replaceAll("'rtl'","'ltr'").replaceAll('dir="rtl"','dir="ltr"').replaceAll('he-IL','en-US');
}
for(const file of fs.readdirSync(dist).filter(f=>f.endsWith('.js')&&!['voice-manifest.js','voice-profiles.js','language.js','english-canvas.js'].includes(f))){
 let source=translate(fs.readFileSync(path.join(dist,file),'utf8'),file);
 if(file==='game.js')source=source.replace(/Avri\|Asaf\|Asaf\|Avri/g,'Guy|David|Mark|Daniel|Ryan|George|Eric|Christopher');
 if(file==='prologue.js')source=source.replace("name.match(/ד״ר (\\S+)/)","name.match(/Dr\\. (\\S+)/)");
 acorn.parse(source,{ecmaVersion:'latest',sourceType:'module'});fs.writeFileSync(path.join(dist,'en',file),source);
}
// Voice identity and mouth animation use the same English speaker names as subtitles.
fs.writeFileSync(path.join(dist,'en/voice-profiles.js'),`import {ROBOT_LINES} from './robot-room.js';
export const VOICE_CAST={player:{actor:'en-US-GuyNeural'},noa:{actor:'en-US-EricNeural'},amir:{actor:'en-GB-RyanNeural'},maya:{actor:'en-US-ChristopherNeural'},yoav:{actor:'en-US-RogerNeural'},news:{actor:'en-US-BrianNeural'},pa:{actor:'en-US-SteffanNeural'},robot:{actor:'en-US-AndrewNeural'}};
export function speakerFor(text,{robot=false}={}){if(robot||ROBOT_LINES.includes(text))return 'robot';const who=text.split(':')[0];return ({Adam:'player',Noa:'noa',Amir:'amir',Maya:'maya',Yoav:'yoav','News Anchor':'news',News:'news',PA:'pa',Robot:'robot'})[who]||'narrator';}
`);
// Only include spoken lines that still occur in the current story.
const heVoices=JSON.parse(fs.readFileSync(path.join(dist,'voice-manifest.js'),'utf8').split('=').slice(1).join('=').trim().replace(/;$/,''));
const voiceLines=[];for(const text of Object.keys(heVoices))if(translations.has(text))voiceLines.push(translations.get(text));
fs.writeFileSync(path.join(root,'localization/spoken-english.json'),JSON.stringify(voiceLines,null,2));
// Metadata scripts are translated as structured data, never by replacing code.
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const htmlHe=JSON.parse(fs.readFileSync(path.join(root,'localization/html-catalog.json'),'utf8')),htmlEn=JSON.parse(fs.readFileSync(path.join(root,'localization/html-english.json'),'utf8'));
if(htmlHe.length!==htmlEn.length)throw Error('Incomplete HTML translations');
const htmlMap=new Map(htmlHe.map((v,i)=>[v,htmlEn[i]]));htmlMap.set('החלפת שפה מתחילה משחק חדש','Switch language (starts a new game)');
html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/,(_,s)=>{const data=JSON.parse(s);Object.assign(data,{name:'Spider House',alternateName:'This House Is Taken',inLanguage:['en','he'],description:htmlEn[50]});return '<script type="application/ld+json">'+JSON.stringify(data)+'</script>';});
html=html.replace(/>([^<>]*[\u0590-\u05ff][^<>]*)</g,(_,s)=>{if(!htmlMap.has(s))throw Error('Missing HTML text '+s);return '>'+htmlMap.get(s)+'<';});
html=html.replace(/((?:content|aria-label|title)=")([^"]*[\u0590-\u05ff][^"]*)(")/g,(_,a,s,b)=>{if(!htmlMap.has(s))throw Error('Missing attribute '+s);return a+htmlMap.get(s)+b;});
html=html.replace('lang="he" dir="rtl"','lang="en" dir="ltr"').replaceAll('he_IL','en_US').replaceAll('href="style.css','href="../style.css').replaceAll('src="language.js','src="../language.js').replaceAll('href="assets/','href="../assets/').replace('href="./"','href="./?lang=en"');
html=html.replace(/<script type="importmap">([\s\S]*?)<\/script>/,(_,s)=>{const map=JSON.parse(s);delete map.imports['./vendor/three.module.js'];return '<script type="importmap">'+JSON.stringify(map)+'</script>';});
html=html.replace(/<a id="language-switch"[^>]*>[\s\S]*?<\/a>/,'<a id="language-switch" class="language-switch" href="../?lang=he" lang="he" hreflang="he" dir="rtl" title="Switch language (starts a new game)">עברית</a>');
html=html.replace('</head>','<script src="../english-canvas.js?v=1.99"></script></head>');
html=html.replace('rel="canonical" href="https://spider-house-adam-night.dandoshtom.chatgpt.site/"','rel="canonical" href="https://spider-house-adam-night.dandoshtom.chatgpt.site/en/"');
fs.writeFileSync(path.join(dist,'en/index.html'),html);
console.log('English build: '+translations.size+' game strings, '+htmlHe.length+' page strings, '+voiceLines.length+' spoken lines.');
