import * as T from './vendor/three.module.js';
import {createSpider} from './spider-model.js';
const smooth=u=>{u=T.MathUtils.clamp(u,0,1);return u*u*(3-2*u);};
export const TRANSPORT_DURATION=9.3;
export function transportPose(time){const t=Math.max(0,time),travel=smooth(t/6.2),eyeClose=smooth((t-6.2)/1.2);return{travel,eyeClose,fade:Math.max(0,1-t/.65),done:t>=TRANSPORT_DURATION};}
export function createCaptureTransport(){
 const scene=new T.Scene();scene.background=new T.Color(0x111c24);scene.fog=new T.Fog(0x111c24,9,36);const camera=new T.PerspectiveCamera(70,1,.055,55);scene.add(camera);scene.add(new T.HemisphereLight(0x9ebed7,0x302b23,1.4));const moon=new T.DirectionalLight(0x9dbbd2,2.1);moon.position.set(-8,13,5);scene.add(moon);const porch=new T.PointLight(0xf1ba76,35,16);porch.position.set(1.9,2.8,-16);scene.add(porch);
 const wood=new T.MeshStandardMaterial({color:0x51453b,roughness:.94}),dark=new T.MeshStandardMaterial({color:0x182126,roughness:.85}),stone=new T.MeshStandardMaterial({color:0x4b514e,roughness:1});
 function box(w,h,d,mat,x,y,z,name){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),mat);mesh.position.set(x,y,z);if(name)mesh.name=name;scene.add(mesh);return mesh;}
 box(36,.12,45,new T.MeshStandardMaterial({color:0x27392f,roughness:1}),0,-.1,-9);box(3.6,.03,22,stone,0,-.015,-5,'Path from laboratory to spider house');for(let i=0;i<22;i++)box(3.5,.012,.025,dark,0,.008,4-i);
 for(const side of [-1,1]){box(4.4,3.3,.35,wood,side*4.2,1.65,-17);box(6.3,3.2,.35,wood,side*3.15,4.9,-17);for(const y of [.4,1,1.6,2.2,2.8,3.4,4,4.6,5.2,5.8,6.4])box(6,.045,.08,dark,side*3.3,y,-16.78);for(const y of [2.1,5]){box(1.3,1.6,.11,dark,side*4.3,y,-16.7);box(.055,1.6,.07,wood,side*4.3,y,-16.6);box(1.3,.055,.07,wood,side*4.3,y,-16.6);}box(.15,3.25,.7,wood,side*2.1,1.62,-16.8);}
 box(13,.25,4.8,dark,0,6.65,-18.5);box(4.8,.14,3.7,wood,0,.03,-15.5);box(4.8,.14,.7,stone,0,-.02,-13.4);box(3.8,3.1,.08,dark,0,1.55,-17.35,'Dark entrance to the original spider house');for(const x of [-2.2,2.2])box(.15,3.6,.15,wood,x,1.8,-14.2);box(5,.16,3.4,wood,0,3.6,-15.6);
 // Splintered frame and cobwebs connect the capture to the haunted house.
 for(let i=0;i<8;i++){const splinter=box(.12,.035,.7,wood,(i%4-1.5)*.7,.06,-14.3-Math.floor(i/4));splinter.rotation.y=i*1.3;}
 const threads=[];for(const side of [-1,1])for(let i=0;i<13;i++){const x=side*2.1,z=-14.2-i*.2;threads.push(x,3.48,z,x-side*(i%4)*.16,2.2+(i%3)*.35,-16.7);}const webGeo=new T.BufferGeometry();webGeo.setAttribute('position',new T.Float32BufferAttribute(threads,3));scene.add(new T.LineSegments(webGeo,new T.LineBasicMaterial({color:0xb1bcb6,transparent:true,opacity:.5})));
 for(const side of [-1,1])for(let i=0;i<5;i++){box(.24,4.5,.28,wood,side*(5+i%2),2.1,2-i*4);const crown=new T.Mesh(new T.SphereGeometry(1.3,10,8),new T.MeshStandardMaterial({color:0x172c25,roughness:1}));crown.position.set(side*(5+i%2),4,2-i*4);scene.add(crown);}
 const spider=createSpider(scene);spider.g.scale.setScalar(.7);const silk=new T.BufferGeometry();silk.setAttribute('position',new T.BufferAttribute(new Float32Array(8*6),3));const tether=new T.LineSegments(silk,new T.LineBasicMaterial({color:0xd7ddd7,transparent:true,opacity:.78}));tether.name='Silk pulling captured player toward the house';tether.frustumCulled=false;scene.add(tether);
 function update(time,aspect=1){const pose=transportPose(time),z=-13.8*pose.travel;camera.aspect=aspect;camera.updateProjectionMatrix();camera.position.set(Math.sin(time*2.4)*.065,.34+Math.sin(time*10)*.018,z);camera.lookAt(0,1.05,z-4.8);camera.rotation.z=.09+Math.sin(time*4)*.025;spider.g.position.set(0,0,z-2.65);spider.g.rotation.y=0;spider.animate(time,.016,true,'patrol');const a=silk.attributes.position;for(let i=0;i<8;i++){const side=(i%2?1:-1);a.setXYZ(i*2,side*.3,.62,z-1.9);a.setXYZ(i*2+1,side*(.25+i*.018),.19,z+.16);}a.needsUpdate=true;return pose;}
 function dispose(){scene.traverse(o=>{o.geometry?.dispose();o.material?.map?.dispose();o.material?.dispose();});}
 return{scene,camera,spider,tether,update,dispose};
}
