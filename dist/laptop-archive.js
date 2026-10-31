function recordImage(stage){
 const spider='<g stroke="#12171b" stroke-width="9" fill="none">'+[-1,1].map(side=>[0,1,2,3].map(i=>'<path d="M300 122 L'+(300+side*(65+i*9))+' '+(38+i*37)+' L'+(300+side*(112+i*6))+' '+(23+i*48)+'"/>').join('')).join('')+'</g><ellipse cx="300" cy="93" rx="37" ry="45" fill="#11171b"/><ellipse cx="300" cy="139" rx="30" ry="25" fill="#182025"/><circle cx="290" cy="140" r="4" fill="#b76f56"/><circle cx="310" cy="140" r="4" fill="#b76f56"/>';
 const walls='<path d="M0 190H600M90 0V190M510 0V190M90 190L0 250M510 190L600 250" stroke="#72817e" fill="none" opacity=".4"/><path d="M90 60H510M90 120H510M200 0V190M400 0V190" stroke="#50615f" fill="none" opacity=".3"/>';
 let details=stage===0?'<g transform="translate(50,-8) rotate(18 300 120)">'+spider+'</g>':spider;
 if(stage===1)details='<rect x="185" y="18" width="230" height="182" fill="#6a9ca133" stroke="#98b0a6" stroke-width="5"/><path d="M185 18L225 90L185 145M415 18L373 75L415 120M185 200L232 175L219 200M415 200L362 180L390 200" fill="#afccca77" stroke="#afccca"/>'+details+'<path d="M220 218l35-12-8 23zM355 212l19 17 19-11z" fill="#9dbbb7"/>';
 if(stage===2){for(const [x,flip]of [[85,1],[510,-1]])details+='<g transform="translate('+x+',120) scale('+flip+',1)"><circle cx="0" cy="13" r="14" fill="#777b70"/><path d="M-17 3h34v10h-34z" fill="#243c50"/><path d="M-15 30h30l9 53h-48z" fill="#29445b"/><path d="M-9 80l-10 43M10 80l12 43" stroke="#172b38" stroke-width="13"/><path d="M6 36L39 21" stroke="#29445b" stroke-width="12"/><path d="M33 20h28" stroke="#121b21" stroke-width="7"/><path d="M65 15l12 4-12 5" fill="#c9ae72"/></g>';details+='<path d="M165 134L240 148M431 135L363 148" stroke="#c9ae7277" stroke-dasharray="10 16"/>';}
 return '<svg viewBox="0 0 600 250" role="img" aria-label="'+['העכביש מטפס על קיר המעבדה','העכביש פורץ את הזכוכית','שוטרים מנסים לעצור את העכביש'][stage]+'" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="250" fill="#384b4d"/>'+walls+details+'<rect x="8" y="8" width="584" height="234" fill="none" stroke="#bfbe9b66"/><text x="20" y="30" fill="#c3c6af" font-family="monospace" font-size="13">CAM 0'+(stage+1)+' / ARCHIVE</text></svg>';
}
export const ARCHIVE_HTML='<p>ארכיון המעבדה · שלוש תמונות מאוירות מהאירוע</p>'+[
 ['01 · לפני הפריצה','הוא היה חי. הוא למד לטפס על הקירות, ואז הגיע לתקרה.'],
 ['02 · התא נפרץ','הזכוכית נשברה מבפנים. כשהצוות חזר, התא כבר היה ריק.'],
 ['03 · השוטרים הגיעו','השוטרים ניסו לעצור את העכביש בירי. הדיווח האחרון נקטע. לא ידוע לאן הוא ברח.']
].map(([title,caption],i)=>'<figure class="archive-record">'+recordImage(i)+'<figcaption><strong>'+title+'</strong><p>'+caption+'</p></figcaption></figure>').join('')+'<p>הערה אחרונה: אל תישארו כאן. חפשו דרך לצאת.</p>';
export function buildArchiveDesk({THREE,scene,box,solid,glow,label}){const H=-4.2;
 solid(2.4,.12,1.2,0x5b4e3c,6,H+.9,-36.5);for(const x of [5,7])for(const z of [-36.95,-36.05])box(.1,.88,.1,0x373d37,x,H+.44,z);
 box(.85,.055,.6,0x273337,6,H+1,-36.45);const screen=box(.88,.58,.045,0x1b2529,6,H+1.29,-36.72);screen.rotation.x=-.12;box(.75,.45,.02,0x365857,6,H+1.29,-36.68);for(let i=0;i<9;i++)box(.055,.012,.18,0x6a7772,5.66+i*.08,H+1.036,-36.43);label('ארכיון 08',6,H+1.3,-36.65,0,'#bed4b8',.65);glow(0x81b6ae,.8,4,6,H+1.5,-36);
 solid(.85,.6,.8,0x4b493d,6,H+.3,-35.2);box(.85,.9,.12,0x4b493d,6,H+.9,-34.85);return{x:6,y:H,z:-34.7};}
