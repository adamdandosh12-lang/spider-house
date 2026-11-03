import * as THREE from './vendor/three.module.js';
import {createSpider} from './spider-model.js';
// A separate scene keeps the face visible even in a narrow room or on a phone.
export function createCaptureScare(){
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x020204);
 const camera=new THREE.PerspectiveCamera(62,1,.025,20),spider=createSpider(scene);
 scene.add(new THREE.HemisphereLight(0x9cbdc9,0x140606,2));
 const rim=new THREE.PointLight(0xff341c,22,9);rim.position.set(2,2,0);scene.add(rim);
 const face=new THREE.PointLight(0xc7e5ff,15,7);face.position.set(-1,2,-3);scene.add(face);
 for(const eye of spider.eyes??[])eye.material.emissiveIntensity=2;
 const mouth=new THREE.Mesh(new THREE.SphereGeometry(.21,20,16),new THREE.MeshBasicMaterial({color:0x030102}));
 mouth.position.set(0,.57,-1.28);mouth.scale.set(1,1.25,.5);spider.body.add(mouth);
 function update(t,aspect){
  camera.aspect=aspect;camera.updateProjectionMatrix();
  const rush=1-Math.pow(1-Math.min(1,t/.22),3),u=Math.max(0,Math.min(1,(t-.62)/.42)),bite=u*u*(3-2*u),shake=Math.exp(-t*2.6)+Math.sin(bite*Math.PI)*.8;
  camera.position.set(Math.sin(t*91)*.035*shake,1.02-bite*.47+Math.sin(t*73)*.025*shake,-3.8+1.77*rush+bite*.62);
  camera.lookAt(0,.94-bite*.38,-1.1);camera.rotation.z=Math.sin(t*67)*.035*shake;
  spider.animate(t,.016,false,'chase',null,null,{grab:0,lift:0,open:1-bite*.85,bite:bite*.2,fade:0});
  return {fade:Math.max(0,Math.min(1,(t-.98)/.45)),done:t>=1.85};
 }
 return{scene,camera,spider,update};
}
