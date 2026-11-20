import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import path from 'node:path';
const root=new URL('../dist/',import.meta.url),read=f=>fs.readFileSync(new URL(f,root),'utf8');
test('English scenes contain no untranslated Hebrew strings and import existing modules',()=>{
 for(const file of fs.readdirSync(new URL('en/',root)).filter(f=>f.endsWith('.js'))){const source=read('en/'+file);assert.doesNotMatch(source,/[\u0590-\u05ff]/,file);for(const m of source.matchAll(/from ['"]([^'"]+)['"]/g))assert.ok(fs.existsSync(new URL(m[1],new URL('en/'+file,root))),file+' '+m[1]);}
 const html=read('en/index.html');assert.match(html,/lang="en" dir="ltr"/);assert.match(html,/Enter the House/);assert.match(html,/hreflang="he"/);assert.match(read('index.html'),/href="en\/\?lang=en"/);
});
test('Language selection persists, preserves query options, and switches without redirect loops',()=>{
 function boot(pathname,search,stored){let destination=null;const data=new Map(stored?[['spider-house-language',stored]]:[]);const context={URL,URLSearchParams,location:{pathname,search,href:'https://example.com'+pathname+search,replace:u=>destination=u},localStorage:{getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)},document:{addEventListener(){}}};vm.runInNewContext(read('language.js'),context);return{destination,data};}
 assert.equal(boot('/','?lang=en&starter-axe=0').destination,'https://example.com/en/?lang=en&starter-axe=0');assert.equal(boot('/en/','?lang=en','he').destination,null);assert.equal(boot('/en/','?lang=he').destination,'https://example.com/?lang=he');assert.equal(boot('/','','en').destination,'https://example.com/en/');assert.equal(boot('/en/','','en').destination,null);
});
test('Every translated spoken line has packaged English audio',()=>{
 const lines=JSON.parse(fs.readFileSync(new URL('../localization/spoken-english.json',import.meta.url),'utf8'));
 const manifest=JSON.parse(read('en/voice-manifest.js').split('=').slice(1).join('=').trim().replace(/;$/,''));assert.equal(lines.length,72);
 for(const line of lines){assert.ok(manifest[line],line);for(const file of manifest[line])assert.ok(fs.statSync(new URL(file,new URL('en/',root))).size>1000,file);}
});
