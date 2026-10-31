import {addHauntedTV} from './haunted-tv.js';
export function buildBasement({THREE,scene,box,solid,sphere,label,glow,wardrobe}){
 const H=-4.2;const slabs=[];
 box(26,.22,17,0x303735,0,H-.11,-32);box(26,.18,17,0x252e30,0,H+3.65,-32);slabs.push({x:0,z:-32,w:26,d:17,bottom:H+3.56,top:H+3.74});
 for(const x of [-13,13])solid(.3,3.6,17,0x3b4543,x,H+1.8,-32);solid(26,3.6,.25,0x36403e,0,H+1.8,-40.5);
 solid(3.5,3.6,.25,0x36403e,-11.25,H+1.8,-23.5);solid(19.5,3.6,.25,0x36403e,3.25,H+1.8,-23.5);
 // A second, separate stairwell descends from the library.
 for(let i=1;i<=20;i++){const y=-4.2*i/20,z=-14-(i-.5)*.5;box(2.95,.24,.5,0x625744,-8,y-.12,z);for(const x of [-9.57,-6.43]){solid(.16,3.2,.5,0x3b4543,x,y+1.6,z);box(.1,.1,.5,0x756750,x+Math.sign(-8-x)*.13,y+.95,z);}box(3.2,.12,.5,0x252e30,-8,y+3.25,z);}
 label('למרתף',-8,2.7,-13.85,0,'#c2c8a4',2);label('מרתף — אל תיגע בטלוויזיה',-3,H+2.6,-40.25,0,'#adb9a5',5);label('למעלה: הספרייה',-8,H+2.5,-24.1,Math.PI,'#b5d2b0',2.5);
 wardrobe(-10,H,-38,'שמיכות ישנות');wardrobe(10,H,-38,'ארגזי אחסון');
 for(const [x,z]of [[-11,-31],[10,-27],[10,-34]]){solid(1.4,1.1,1.2,0x514b3b,x,H+.55,z);box(1.45,.08,1.25,0x645a44,x,H+1.14,z);}
 const before=new Set(scene.children);const tv=addHauntedTV({scene,box,sphere,label});const tvSet=new THREE.Group();tvSet.name='Basement haunted TV and props';tvSet.position.set(-7,H,-28);for(const o of [...scene.children])if(!before.has(o))tvSet.add(o);scene.add(tvSet);tv.reset();
 solid(2.2,1.05,.75,0x393e37,4,H+.525,-31.9);box(1.9,1.1,.3,0x172321,4,H+1.6,-31.83);solid(.9,.8,.9,0x453c30,0,H+.4,-31);
 const chair=new THREE.Group();chair.name='Self-rocking basement chair';chair.position.set(0,H+.14,-31);scene.add(chair);
 box(1,.13,1,0x554b3e,0,.65,0,chair);box(1,1.2,.12,0x554b3e,0,1.25,.4,chair);for(const x of [-.4,.4]){for(const z of [-.35,.35])box(.1,.6,.1,0x453c30,x,.3,z,chair);box(.13,.1,1.5,0x453c30,x,0,0,chair);box(.13,.1,1,0x625643,x,.95,0,chair);}
 const chairs=[chair];for(const [x,z,turn]of [[2,-34,.25],[8,-32,-.35]]){const extra=chair.clone(true);extra.position.set(x,H+.14,z);extra.rotation.y=turn;scene.add(extra);chairs.push(extra);solid(.9,.8,.9,0x453c30,x,H+.4,z);}
 const silk=[];for(const x of [-12.6,12.6])for(const z of [-39.8,-24]){const sx=-Math.sign(x),sz=z< -30?1:-1;for(let i=0;i<=10;i++){const a=i/10*Math.PI/2;silk.push(x,H+3.3,z,x+sx*Math.cos(a)*2.7,H+3.15,z+sz*Math.sin(a)*2.7);}for(let r=.5;r<2.7;r+=.4)for(let i=0;i<10;i++){const a=i/10*Math.PI/2,b=(i+1)/10*Math.PI/2;silk.push(x+sx*Math.cos(a)*r,H+3.25,z+sz*Math.sin(a)*r,x+sx*Math.cos(b)*r,H+3.25,z+sz*Math.sin(b)*r);}}
 const webGeo=new THREE.BufferGeometry();webGeo.setAttribute('position',new THREE.Float32BufferAttribute(silk,3));scene.add(new THREE.LineSegments(webGeo,new THREE.LineBasicMaterial({color:0xb0beb5,transparent:true,opacity:.48})));
 // Additional skull specimens on a low shelf; no injury or gore.
 box(2,.12,.65,0x574e40,-9,H+.75,-39.8);for(const x of [-9.5,-8.7]){sphere(.2,0xb4ae95,x,H+1,-39.75,scene,1,1.1,.9);for(const side of [-1,1])sphere(.05,0x202724,x+side*.075,H+1.02,-39.58,scene,1,1,.5);}
 const lamps=[glow(0x91aaa9,2.3,18,-6,H+2.9,-31),glow(0x91aaa9,2.3,18,6,H+2.9,-36)];for(const z of [-16,-20,-24])glow(0x91aaa9,1.8,8,-8,-Math.min(4.2,(-14-z)*.42)+2.5,z);
 let lastCreak=-1;return{slabs,tv,chair,chairs,lamps,reset(){lastCreak=-1;tv.reset();for(const c of chairs)c.rotation.x=0;},update(time){const on=tv.update(time+9);for(let i=0;i<chairs.length;i++)chairs[i].rotation.x=Math.sin(time*(1.15+i*.13)+i*.8)*.075;for(let i=0;i<lamps.length;i++){const wave=(Math.sin(time*.45+i*1.7)+1)/2;lamps[i].intensity=2.3*Math.max(0,(wave-.35)/.65);}const beat=Math.floor(time/5);const creak=beat!==lastCreak;lastCreak=beat;return{on,creak};}};
}
