import {execFile} from 'node:child_process';
const url='http://127.0.0.1:4173/';
async function ready(){try{const r=await fetch(url,{signal:AbortSignal.timeout(1500)});return r.ok&&(await r.text()).includes('הבית של העכביש');}catch{return false;}}
if(!await ready()){
 await import('./server.mjs');
 for(let i=0;i<20&&!await ready();i++)await new Promise(resolve=>setTimeout(resolve,250));
}
if(await ready()){
 console.log('המשחק מוכן. השאירו את החלון פתוח בזמן המשחק.');
 execFile('explorer.exe',[url],{windowsHide:true},()=>{});
}else console.error('המשחק לא הצליח להיפתח. יש לבדוק אם תוכנה אחרת משתמשת בכתובת 4173.');
