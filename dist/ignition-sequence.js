import * as T from './vendor/three.module.js';
import {createPlayerHand} from './player-hand.js';
export function createIgnitionSequence({camera,group,starter,click,onMotor,onDone,position}){
 const rig=new T.Group();rig.name='Ignition barrel and inserted key';rig.position.copy(position||new T.Vector3(.03,1.14,-.25));group.add(rig);rig.lookAt(camera.position);
 const steel=new T.MeshStandardMaterial({color:0xb8bfc1,metalness:.8,roughness:.22}),black=new T.MeshStandardMaterial({color:0x242c30,roughness:.6});
 const bezel=new T.Mesh(new T.TorusGeometry(.064,.012,12,32),steel);rig.add(bezel);const barrel=new T.Mesh(new T.CylinderGeometry(.052,.052,.035,32),black);barrel.rotation.x=Math.PI/2;rig.add(barrel);
 const slit=new T.Mesh(new T.BoxGeometry(.012,.043,.002),new T.MeshBasicMaterial({color:0x020304}));slit.position.z=.019;rig.add(slit);
 const key=new T.Group();key.name='Handheld car ignition key';rig.add(key);
 function box(w,h,d,mat,x,y,z){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);key.add(m);return m;}
 box(.017,.032,.16,steel,0,0,-.06);for(let i=0;i<4;i++)box(.012,.012,.018,steel,.01,(i%2?1:-1)*.012,-.115+i*.027);
 const head=new T.Mesh(new T.SphereGeometry(1,20,14),black);head.scale.set(.055,.075,.021);head.position.z=.035;key.add(head);box(.028,.012,.005,steel,0,.015,.057);
 const ring=new T.Mesh(new T.TorusGeometry(.034,.004,8,24),steel);ring.position.set(0,-.092,.035);key.add(ring);
 const hand=createPlayerHand(T,camera);let time=0,active=false,inserted=false,started=false,motor=false,done=false;
 const home=new T.Vector3(.17,-.12,.39),aligned=new T.Vector3(0,0,.36),seated=new T.Vector3(0,0,.145);
 const smooth=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u);};
 key.position.copy(home);
 function begin(){if(!active){active=true;time=0;}}
 function update(dt){if(!active||done)return;time+=dt;
  if(time<.65)key.position.copy(home).lerp(aligned,smooth(time/.65));else key.position.copy(aligned).lerp(seated,smooth((time-.65)/.6));
  key.rotation.z=-.95*smooth((time-1.25)/.65)+.48*smooth((time-2.2)/.4);
  if(time>=1.25&&!inserted){inserted=true;click();}
  if(time>=1.65&&!started){started=true;starter();}
  if(time>=2.2&&!motor){motor=true;onMotor();}
  group.updateMatrixWorld(true);camera.updateMatrixWorld(true);
  const palm=key.localToWorld(new T.Vector3(0,-.13,.08));camera.worldToLocal(palm);hand.grip(1);hand.g.position.copy(palm);hand.g.rotation.z=key.rotation.z;
  if(time>2.4){hand.g.position.y-=smooth((time-2.4)/.55)*.5;}
  const task=document.getElementById('intro-task');task.textContent=time<.65?'מקרב את המפתח למתג ההתנעה…':time<1.25?'מכניס את המפתח…':time<2.2?'מסובב את המפתח • המנוע מתניע…':'המנוע פועל • יוצאים לעבודה';document.getElementById('intro-prompt').textContent='';
  if(time>=3){done=true;hand.reset();hand.g.rotation.z=0;onDone();}
 }
 function dispose(){hand.reset();hand.g.rotation.z=0;}
 return{rig,key,begin,update,dispose,get inserted(){return inserted;},get motor(){return motor;},get time(){return time;}};
}
