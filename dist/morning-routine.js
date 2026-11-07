import * as T from './vendor/three.module.js';
function builder(parent){return(w,h,d,color,x,y,z)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,roughness:.55,metalness:color===0x9da9aa?.7:0}));m.position.set(x,y,z);parent.add(m);return m;};}
export function buildMorningWardrobe(group){
 const g=new T.Group();g.position.set(5,0,5.8);group.add(g);const box=builder(g);
 for(const x of [-.87,.87])box(.1,2.6,.75,0x64513e,x,1.3,0);for(const y of [.06,2.55])box(1.8,.1,.75,0x64513e,0,y,0);box(1.8,2.5,.07,0x44372e,0,1.3,.35);box(1.6,.035,.035,0x9da9aa,0,2.2,0);
 const doors=[];for(const side of [-1,1]){const pivot=new T.Group();pivot.position.set(side*.9,0,-.4);g.add(pivot);const panel=builder(pivot);panel(.89,2.5,.065,0x7b6249,-side*.445,1.3,0);panel(.035,.2,.04,0xc1b28d,-side*.78,1.3,-.06);doors.push({pivot,side});}
 const clothes=new T.Group();clothes.name='Hanging work clothes';g.add(clothes);const coat=builder(clothes);coat(.55,.85,.12,0xe0e5dc,0,1.63,.03);for(const side of [-1,1]){const sleeve=coat(.16,.68,.13,0xd4dbd4,side*.33,1.67,.03);sleeve.rotation.z=side*.14;coat(.21,.7,.1,0x34423e,side*.14,.85,.02);}coat(.035,.8,.015,0x536865,0,1.6,-.04);
 function open(u){for(const d of doors)d.pivot.rotation.y=-d.side*u*1.6;}
 return{doors,clothes,open};
}
export function buildMorningYard(group){
 const box=builder(group);box(40,.2,32,0x657b54,0,-.12,0);box(7,.03,15,0xa7a397,-1,0,0);box(10,5,.3,0xb7ad98,0,2.5,7.7);box(11,.2,1.4,0x635d51,0,5.1,7.5);box(1.7,2.9,.12,0x57442c,0,1.45,7.5);for(const x of [-3.5,3.5]){box(1.8,1.6,.1,0x8bafbf,x,2.4,7.5);box(.07,1.6,.12,0xe4ddc9,x,2.4,7.42);box(1.8,.07,.12,0xe4ddc9,x,2.4,7.42);}
 for(const x of [-7,7])for(let z=-6;z<=6;z+=3){box(.18,1.1,.18,0x6b5b44,x,.55,z);const crown=new T.Mesh(new T.SphereGeometry(.75,12,10),new T.MeshStandardMaterial({color:0x3f6649}));crown.position.set(x,1.4,z);group.add(crown);}
 const car=new T.Group();car.name='Player car parked outside home';car.position.set(-.4,0,-3.1);group.add(car);const cb=builder(car);
 cb(2,.45,4,0x365657,0,.65,0);cb(1.9,.3,1.1,0x496f70,0,.98,-1.35);cb(1.75,.09,1.9,0x365657,0,1.7,.1);cb(1.6,.55,.06,0x799aa6,0,1.36,-.87);cb(1.6,.5,.06,0x64858b,0,1.35,1.1);cb(.08,.57,1.9,0x365657,.9,1.35,.1);cb(.04,.45,1.6,0x7696a0,.92,1.4,.1);cb(.12,.2,1.8,0x3b5556,-.9,1,.1);
 for(const side of [-1,1])for(const z of [-1.25,1.25]){const wheel=new T.Mesh(new T.CylinderGeometry(.36,.36,.18,20),new T.MeshStandardMaterial({color:0x172124,roughness:.9}));wheel.rotation.z=Math.PI/2;wheel.position.set(side*1.02,.37,z);car.add(wheel);const hub=new T.Mesh(new T.CylinderGeometry(.17,.17,.19,16),new T.MeshStandardMaterial({color:0x9da9aa,metalness:.7}));hub.rotation.copy(wheel.rotation);hub.position.copy(wheel.position);car.add(hub);}
 cb(1.85,.1,.08,0x9da9aa,0,.55,-2.04);for(const x of [-.65,.65])cb(.4,.18,.06,0xe1e2b8,x,.86,-2.03);
 const door=new T.Group();door.position.set(-1,0,-.8);car.add(door);const db=builder(door);db(.07,.55,1.65,0x365657,0,.95,.825);db(.045,.45,1.6,0x7899a4,0,1.45,.825);db(.09,.04,.2,0x9da9aa,-.06,1.15,1.3);
 cb(.6,.25,.7,0x253436,-.42,.64,.3);cb(.6,.7,.16,0x253436,-.42,1.05,.65);
 return{door,target:{x:-2.1,z:-2.7,title:'פתח את דלת הנהג והיכנס למכונית'},blocked(x,z){return Math.abs(x+.4)<1.35&&Math.abs(z+3.1)<2.3;}};
}
