// A local convenience preference, not an account permission or an authentication token.
export function startingAxeEnabled(search=globalThis.location?.search||''){
 const choice=new URLSearchParams(search).get('starter-axe');
 if(choice==='1'||choice==='0'){
  try{globalThis.localStorage?.setItem('spider-house-starting-axe',choice);}catch{}
  return choice==='1';
 }
 try{return globalThis.localStorage?.getItem('spider-house-starting-axe')==='1';}catch{return false;}
}
