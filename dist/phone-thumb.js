import * as T from './vendor/three.module.js';
export function createPhoneThumb(phone){
 const g=new T.Group();g.name='Holding hand thumb';phone.add(g);const skin=new T.MeshPhysicalMaterial({color:0xc09378,roughness:.73}),nailMat=new T.MeshStandardMaterial({color:0xd8b5a0,roughness:.5});
 const bones=[new T.Mesh(new T.CylinderGeometry(.018,.023,1,12),skin),new T.Mesh(new T.CylinderGeometry(.014,.018,1,12),skin)];bones.forEach(b=>g.add(b));const knuckle=new T.Mesh(new T.SphereGeometry(.019,14,10),skin),tip=new T.Mesh(new T.SphereGeometry(.017,14,10),skin);tip.scale.set(.9,1,.8);g.add(knuckle,tip);const nail=new T.Mesh(new T.SphereGeometry(1,12,8),nailMat);nail.scale.set(.009,.012,.002);g.add(nail);const base=new T.Vector3(.09,-.085,-.035),up=new T.Vector3(0,1,0);
 function pose(amount){const u=Math.max(0,Math.min(1,amount)),middle=new T.Vector3(.125,-.015,.02).lerp(new T.Vector3(.025,-.01,.075),u),end=new T.Vector3(.115,.025,.027).lerp(new T.Vector3(-.058,.031,.036),u);knuckle.position.copy(middle);tip.position.copy(end);nail.position.copy(end).add(new T.Vector3(0,0,.014));for(let i=0;i<2;i++){const a=i?middle:base,b=i?end:middle,bone=bones[i];bone.position.copy(a).add(b).multiplyScalar(.5);bone.scale.y=a.distanceTo(b);bone.quaternion.setFromUnitVectors(up,b.clone().sub(a).normalize());}g.visible=true;g.userData.press=amount;}
 pose(0);return{g,pose,get tip(){return tip;}};
}
