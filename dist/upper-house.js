import {buildSpiderLab} from './spider-lab.js';
﻿import {FLOOR_HEIGHT as H,upperRooms}from'./house-world.js';
export function buildUpperHouse({THREE,scene,box,solid,label,glow,colliders,hides,wardrobe}){
 const before=new Set(scene.children),start=colliders.length;
 // The second floor has a real opening over the staircase, not a solid ceiling.
 const slabs=[];const slab=(w,d,x,z)=>{box(w,.22,d,0x342e29,x,H-.11,z);slabs.push({x,z,w,d,bottom:H-.22,top:H});};
 slab(11.4,31,-7.3,-11.5);slab(11.4,31,7.3,-11.5);slab(3.2,3,0,-25.5);slab(3.2,18,0,-5);
 box(26,.18,31,0x252b30,0,H+3.65,-11.5);
 for(const x of [-13,13])solid(.35,3.6,31,0x46504f,x,H+1.8,-11.5);
 for(const x of [-7.75,7.75])solid(10.5,3.6,.3,0x344046,x,H+1.8,4);for(const x of [-7.4,7.4])solid(11.2,3.6,.3,0x344046,x,H+1.8,-27);
 // Ground floor's north wall has an opening into this enclosed stairwell.
 for(const x of [-1.75,1.75])solid(.25,H,13.3,0x3c4647,x,H/2,-20.5);
 solid(3.5,4.2,.25,0x3c4647,0,2.1,-27);
 // Rails face the staircase; outside the rails the upstairs hall reaches every room.
 for(const x of [-1.57,1.57]){
  for(let i=0;i<=20;i++){let z=-14-i*.5,h=H*i/20;box(.07,.95,.07,0x6a5036,x,h+.48,z);}
  const rail=new THREE.Mesh(new THREE.BoxGeometry(.1,.1,Math.hypot(10,H)),new THREE.MeshStandardMaterial({color:0x856c45,roughness:.65}));rail.position.set(x,H/2+1,-19);rail.rotation.x=Math.atan2(H,10);scene.add(rail);
 }
 for(let i=1;i<=20;i++){const h=H*i/20,z=-14-(i-.5)*.5;box(2.95,h,.5,0x5d4936,0,h/2,z);box(3.02,.035,.1,0xa58a5c,0,h+.018,z+.19);}
 // Glass-free rail walls prevent sideways exits into the staircase void.
 colliders.push({x:-1.57,z:-19,w:.09,d:10,bottom:0,top:H+.9},{x:1.57,z:-19,w:.09,d:10,bottom:0,top:H+.9});
 // Three bedrooms and three distinct utility rooms, all with two-sided signs.
 for(const x of [-3,3])for(const [lo,hi]of [[-27,-22.5],[-20.5,-11.5],[-9.5,-1.5],[.5,4]])solid(.22,3.6,hi-lo,0x46504f,x,H+1.8,(lo+hi)/2);
 for(const x of [-8,8])for(const z of [-16,-5])if(!(x>0&&z===-16))solid(10,3.6,.22,0x424947,x,H+1.8,z);
 for(const r of upperRooms){const side=Math.sign(r.x),doorZ=r.z;
  for(const zz of [doorZ-1.05,doorZ+1.05])box(.38,3,.15,0x57422e,side*3,H+1.5,zz);
  box(.4,.25,2.3,0x57422e,side*3,H+3.02,doorZ);
  if(r.name!=='החדר מספר אחד')label(r.name,side*2.84,H+2.55,doorZ,side<0?Math.PI/2:-Math.PI/2,'#f1d7a3',2.5);
  label(r.name,side*3.17,H+2.55,doorZ,side<0?-Math.PI/2:Math.PI/2,'#f1d7a3',2.5);
  box(.05,1.8,2.5,0x19384e,side*12.77,H+2.1,r.z);box(.14,.09,2.55,0x5d4936,side*12.65,H+2.1,r.z);box(.14,1.9,.08,0x5d4936,side*12.65,H+2.1,r.z);
  glow(0x91b9dc,2.6,11,side*11.5,H+2.5,r.z);
 }
 function bed(x,z,c){solid(3,.65,4,0x57422e,x,H+.33,z);box(2.9,.27,3.9,0xb8ac94,x,H+.8,z);box(2.95,.18,2.4,c,x,H+.98,z+.6);box(2.3,.16,.7,0xd3c8af,x,H+1,z-1.3);box(3.1,1.5,.15,0x57422e,x,H+.8,z-2);}
 bed(-9,-22,0x334f5f);bed(-9,-.3,0x536047);
 for(const [x,z,name]of [[-5,-24.5,'בגדים'],[5,-24.5,'חלוקי מעבדה'],[-5,-13.5,'מגבות'],[5,-8,'ציוד ניסויים'],[-5,1.5,'מצעים'],[5,1.5,'תחפושות']])wardrobe(x,H,z,name);
 // Bathroom: tub, toilet, basin and a framed mirror.
 solid(2.3,.75,4,0xaeb7ad,-10,H+.4,-11);box(1.8,.07,3.4,0x20383d,-10,H+.79,-11);box(2,.8,.8,0xb9b9aa,-6,H+.5,-14.7);box(1.5,.04,.55,0x2b393b,-6,H+.93,-14.7);box(1.8,1.4,.07,0x6f8995,-6,H+2,-15.8);solid(1,.65,1.4,0xc3c2b4,-11,H+.35,-6.7);box(.9,1.1,.3,0xc3c2b4,-11,H+.55,-7.4);
 // Office: desk, monitor, keyboard, papers and shelves.
 solid(3,.12,1.5,0x72513b,9,H+.95,-13.5);for(const x of [7.8,10.2])box(.12,.95,1.3,0x403225,x,H+.48,-13.5);box(1.5,.85,.1,0x1b252e,9,H+1.65,-13.8);box(.16,.4,.16,0x343a39,9,H+1.2,-13.8);box(1,.04,.4,0x474d4d,9,H+1.04,-13.1);
 for(let y=.5;y<2.8;y+=.6){box(3,.1,.65,0x72513b,10,H+y,-15.4);for(let i=0;i<8;i++)box(.19,.4,.3,[0x4c5a52,0x805e43,0x5b5262][i%3],8.9+i*.3,H+y+.25,-15.2);}
 // Playroom: a low round-edged-looking block table, toy chest and colorful blocks.
 solid(2.5,.5,1.4,0x72513b,9,H+.3,0);solid(2,.8,1.2,0x496267,11,H+.4,2.8);
 for(let i=0;i<9;i++){let x=7+(i%3)*.5,z=.2+Math.floor(i/3)*.5;box(.28,.28,.28,[0x9e5939,0x4f7278,0x988245][i%3],x,H+.76,z);}
 // Landing signage and warm guiding lights.
 label('קומה שנייה',-2,H+2.4,-26.7,0,'#ffcf98',1.4);label('מדרגות לקומה השנייה',0,2.9,-14.02,0,'#ffcf98',2.6);label('למטה: יציאה',0,H+2.5,-24.5,Math.PI,'#a9f2c2',2.5);
 glow(0xffba77,4,14,0,3.5,-19);glow(0xffb67c,4,12,0,H+2.7,-25);glow(0xffb67c,3,14,0,H+2.8,-9);glow(0xffb67c,3,12,0,H+2.8,1);
 buildSpiderLab({THREE,scene,box,solid,label,glow});
 const objects=[...scene.children].filter(o=>!before.has(o));return{slabs,objects,newColliders:colliders.slice(start)};
}
