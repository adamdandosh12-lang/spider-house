import {HOUSE_WIDTH_SCALE as W,FLOOR_HEIGHT as H} from './house-world.js';
export const NOTES=[{x:-6,z:6,y:0,digit:'7',text:'שורה ראשונה: 7. שמרו את ההמשך בחדר האוכל.'},{x:-6,z:2,y:0,digit:'3',text:'שורה שנייה: 3. הפתק האחרון נמצא למעלה, בחדר המשחקים.'},{x:10,z:2.7,y:H,digit:'1',text:'שורה שלישית: 1. חברו את השורות לפי הסדר, מלמעלה למטה.'}];
export const STOPS={'1':{x:-.35*W,y:0,z:11},'2':{x:0,y:H,z:8},'?':{x:0,y:-8.4,z:-53.6}};
export function createLiftPuzzle(){const notes=new Set();let card=false,unlocked=false;return{notes,get card(){return card;},get unlocked(){return unlocked;},get code(){return notes.size===3?NOTES.map(n=>n.digit).join(''):null;},collect(i){if(Number.isInteger(i)&&i>=0&&i<3)notes.add(i);},collectCard(){card=true;},unlock(value){if(this.code&&value===this.code)unlocked=true;return unlocked;},canTravel(stop){return Object.hasOwn(STOPS,stop)&&unlocked&&(stop!=='?'||card);},reset(){notes.clear();card=false;unlocked=false;}};}
export function buildLiftWing({THREE,scene,box,sphere,solid,label,glow}){
 const bronze=new THREE.MeshStandardMaterial({color:0x796044,metalness:.65,roughness:.72});const dark=0x242725;
 const cabins=[];for(const [floor,z] of [[0,6],[H,6],[-8.4,-56]]){const entry=floor===0,cx=entry?1.65:0,cz=entry?11:z;const g=new THREE.Group();g.position.set(cx,floor,cz);if(entry){g.rotation.y=-Math.PI/2;g.scale.z=.9;}scene.add(g);cabins.push(g);box(2.3,.12,2.6,0x4a3525,0,.06,0,g);box(2.3,.15,2.6,dark,0,2.85,0,g);box(2.3,2.8,.14,dark,0,1.4,-1.3,g);for(const x of [-1.1,1.1]){box(.12,2.8,2.6,dark,x,1.4,0,g);box(.04,.1,2.2,bronze,x*.93,1.05,0,g);}for(let i=-5;i<=5;i++){box(.035,2.6,.04,bronze,i*.19,1.4,1.3,g);}
 const collision=solid(entry?2.34:2.3,2.8,entry?2.3:2.6,dark,cx,floor+1.4,cz);collision.visible=false;collision.userData.dynamic=true;collision.name='Invisible elevator collision';
 label('מעלית • 1 / 2 / ?',entry?.40:0,floor+3.05,entry?11:z+1.36,entry?-Math.PI/2:0,'#d1b77e',2.3);label('E • לוח הבקרה',entry?.36:.85,floor+1.6,entry?11.85:z+1.42,entry?-Math.PI/2:0,'#e4c98a',.7);glow(0xe6ae62,2,7,entry?.15:0,floor+2.6,entry?11:z+1.8);
 }
 // Wide upper landing, with lanes around the cabin back into the upstairs hall.
 box(5,.22,5.2,0x4e4035,0,H-.11,6);box(5,.15,5.2,0x252b30,0,H+3.65,6);for(const x of [-2.5,2.5])solid(.18,3.6,5.2,0x424747,x,H+1.8,6);solid(5,3.6,.18,0x424747,0,H+1.8,8.65);
 const pickups=NOTES.map((n,i)=>{const g=new THREE.Group();g.name='Elevator code note '+(i+1);g.position.set(n.x*W,n.y+.08,n.z);box(.34,.025,.46,0xcbbb90,0,0,0,g);for(let j=0;j<3;j++)box(.23,.004,.012,0x514b3e,0,.015,-.12+j*.09,g);scene.add(g);return g;});
 const card=new THREE.Group();card.name='Secret access card';card.position.set(7*W,H+.08,-24.8);box(.34,.025,.22,0x557b80,0,0,0,card);box(.29,.008,.04,0x111b22,0,.017,-.06,card);box(.06,.009,.06,0xe3bf63,-.09,.019,.03,card);scene.add(card);
 // Separate rock tunnel and research chamber. The fenced shaft cannot trap the player.
 const Y=-8.4;for(const x of [-5.25,5.25])box(6.5,.3,17,0x343b3c,x,Y-.15,-60);box(4,.3,3.5,0x343b3c,0,Y-.15,-66.75);box(4,.3,9.5,0x343b3c,0,Y-.15,-56.25);box(4,.2,4,0x0b1114,0,Y-3,-63);for(const x of [-2,2])box(.12,3,4,0x252c2e,x,Y-1.5,-63);for(const z of [-65,-61])box(4,3,.12,0x252c2e,0,Y-1.5,z);box(17,.3,17,0x202729,0,Y+4.2,-60);
 for(const x of [-8.5,8.5])solid(.4,4.2,17,0x343c40,x,Y+2.1,-60);for(const z of [-51.5,-68.5])solid(17,4.2,.4,0x30383c,0,Y+2.1,z);
 for(const x of [-3,3]){solid(.6,4,4,0x384044,x,Y+2,-57.8);for(let i=0;i<5;i++)sphere(.6,0x485052,x,Y+.6+i*.7,-55.8,scene,.7,1,1);}for(const side of [-1,1])for(let i=0;i<8;i++){sphere(.9,0x414748,side*8,Y+1.6+(i%2),-53-i*1.8,scene,.5,1.4,1);sphere(.58,0x070d10,side*7.8,Y+2,-53-i*1.8,scene,.13,1,1);}
 for(const x of [-2.2,2.2])solid(.14,1.1,4.5,bronze,x,Y+.55,-63);for(const z of [-65.2,-60.8])solid(4.5,1.1,.14,bronze,0,Y+.55,z);
 for(let i=0;i<4;i++){const x=-6+i*.9;box(.7,.08,1.6,0x626b64,x,Y+.8,-67);box(.5,.4,.2,0x343b3c,x,Y+1.05,-67.5);box(.43,.27,.02,0x537874,x,Y+1.07,-67.38);}
 label('תחנת המחקר התחתונה',0,Y+2.8,-68.25,0,'#bdc8ba',4);label('E • דוח משלחת 08',-4.7,Y+1.7,-66.8,0,'#d3c79f',2);
 // Stylized skeletal remains, coats and helmets; no explicit injury.
 for(const [x,z] of [[5,-64],[-6,-59]]){sphere(.22,0xb0aa90,x,Y+.3,z,scene,1,1.2,.9);for(const dx of [-.07,.07])sphere(.055,0x292c28,x+dx,Y+.36,z+.17);box(.5,.09,.8,0x3c504f,x,Y+.09,z+.65);for(let j=0;j<5;j++)box(.38-j*.03,.025,.035,0xa69f88,x,Y+.15,z+.4+j*.1);for(const dx of [-.16,.16])box(.06,.06,.6,0xada58e,x+dx,Y+.1,z+1.3);}
 const web=[];for(let i=0;i<150;i++){const side=i%2?1:-1;const z=-52-(i%16);web.push(side*8,Y+3.8,z,side*(4+(i%5)*.7),Y+.5+(i%7)*.45,z-1.5);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(web,3));scene.add(new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:0xc6cbbb,transparent:true,opacity:.4})));
 for(const [x,z]of [[-5,-55],[5,-60],[-4,-66]])glow(0x9db8a6,3,12,x,Y+3.4,z);
 return{pickups,card,cabins,reset(){pickups.forEach(p=>p.visible=true);card.visible=true;},slabs:[{x:0,z:6,w:5,d:5.2,bottom:H-.22,top:H},{x:0,z:-60,w:17,d:17,bottom:Y-.3,top:Y}]};
}
