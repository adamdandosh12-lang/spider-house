import * as T from './vendor/three.module.js';
import {createPhoneThumb} from './phone-thumb.js';

// Phone-local coordinates keep the fingers on the case as the phone is lifted or turned.
export function createPhoneGrip(phone){
 const g=new T.Group();g.name='Phone holding hand';phone.add(g);
 const skin=new T.MeshPhysicalMaterial({color:0xc09378,roughness:.73}),cloth=new T.MeshStandardMaterial({color:0x34423e,roughness:1});
 function oval(name,mat,x,y,z,sx,sy,sz){const m=new T.Mesh(new T.SphereGeometry(1,16,12),mat);m.name=name;m.position.set(x,y,z);m.scale.set(sx,sy,sz);g.add(m);return m;}
 const palm=oval('Palm behind phone',skin,.014,-.075,-.036,.072,.098,.031);
 oval('Phone wrist',skin,.025,-.185,-.075,.046,.055,.036);
 oval('Phone sleeve',cloth,.03,-.315,-.09,.062,.12,.055);
 const fingers=[];
 for(let i=0;i<4;i++){
  const y=-.12+i*.048,points=[new T.Vector3(-.035,y,-.039),new T.Vector3(-.108,y,-.036),new T.Vector3(-.111,y,.008),new T.Vector3(-.101,y,.018)];
  for(let j=0;j<3;j++){const a=points[j],b=points[j+1],bone=new T.Mesh(new T.CylinderGeometry(.011,.013,a.distanceTo(b),10),skin);bone.position.copy(a).add(b).multiplyScalar(.5);bone.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());g.add(bone);}
  const tip=oval('Finger on phone rim',skin,-.101,y,.018,.012,.015,.012);fingers.push(tip);
 }
 const thumb=createPhoneThumb(g);g.visible=false;
 function hold(amount=1){const u=Math.max(0,Math.min(1,amount));g.visible=u>0;g.position.set(.06*(1-u),-.11*(1-u),-.08*(1-u));}
 return{g,palm,fingers,thumb,hold,hide(){g.visible=false;thumb.pose(0);}};
}
