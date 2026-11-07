import {createStreetCar,addStreetHouse} from './street-models.js';
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
 const box=builder(group);box(80,.2,90,0x657b54,0,-.12,-15);box(70,.04,5,0x4b5156,0,-.01,-11);for(const z of [-8,-14])box(70,.12,1.1,0xc3bdaf,0,.01,z);for(let x=-30;x<31;x+=5)box(2,.015,.09,0xe1dcc4,x,.02,-11);
 const houses=[];for(const side of [-1,1])for(const z of [4,-30,-46])houses.push(addStreetHouse(group,side*20,z,side<0?0xc0b09b:0xa9b6ac,side<0?Math.PI/2:-Math.PI/2));for(const x of [-8,1,10])houses.push(addStreetHouse(group,x,-35,0xb4a496));box(7,.03,15,0xa7a397,-1,0,0);box(10,5,.3,0xb7ad98,0,2.5,7.7);box(11,.2,1.4,0x635d51,0,5.1,7.5);box(1.7,2.9,.12,0x57442c,0,1.45,7.5);for(const x of [-3.5,3.5]){box(1.8,1.6,.1,0x8bafbf,x,2.4,7.5);box(.07,1.6,.12,0xe4ddc9,x,2.4,7.42);box(1.8,.07,.12,0xe4ddc9,x,2.4,7.42);}
 for(const x of [-7,7])for(let z=-6;z<=6;z+=3){box(.18,1.1,.18,0x6b5b44,x,.55,z);const crown=new T.Mesh(new T.SphereGeometry(.75,12,10),new T.MeshStandardMaterial({color:0x3f6649}));crown.position.set(x,1.4,z);group.add(crown);}
 const vehicle=createStreetCar(group);vehicle.g.name='Player car parked outside home';vehicle.g.position.set(-.4,0,-3.1);const door=vehicle.door;
 return{door,vehicle,houses,target:{x:-2.1,z:-2.7,title:'פתח את דלת הנהג והיכנס למכונית'},blocked(x,z){return Math.abs(x+.4)<1.35&&Math.abs(z+3.1)<2.3;}};
}
