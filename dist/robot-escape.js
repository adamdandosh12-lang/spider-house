import * as T from './vendor/three.module.js';
export function createRobotEscape(group,robot){
 const webMaterial=new T.LineBasicMaterial({color:0xe1e5d9,transparent:true,opacity:.9}),geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(new Float32Array(6),3));const shot=new T.LineSegments(geo,webMaterial);shot.frustumCulled=false;shot.visible=false;shot.name='Spider web shot toward robot legs';group.add(shot);
 const wraps=[];for(let i=0;i<18;i++){const angle=i*.85;wraps.push(Math.cos(angle)*.3,.15+i*.017,Math.sin(angle)*.12,Math.cos(angle+.8)*.3,.15+(i+1)*.017,Math.sin(angle+.8)*.12);}const wrapGeo=new T.BufferGeometry();wrapGeo.setAttribute('position',new T.Float32BufferAttribute(wraps,3));const binding=new T.LineSegments(wrapGeo,webMaterial);binding.visible=false;binding.name='Web tied around robot legs';robot.add(binding);
 const legs=robot.children.filter(o=>o.isMesh&&Math.abs(Math.abs(o.position.x)-.18)<.001&&Math.abs(o.position.y-.4)<.001);let state='waiting';
 function update(t,spider){
  if(t<2)return;const run=Math.min(1,(t-2)/4.1);robot.position.set(-2.8+1.6*run,Math.abs(Math.sin(t*13))*.025*(1-run),1+3.9*run);robot.rotation.y=0;for(let i=0;i<legs.length;i++)legs[i].rotation.x=Math.sin(t*13+i*Math.PI)*.35*(t<6.3?1:0);state='fleeing';
  if(t>=6.1){state='webbed';robot.updateMatrixWorld(true);spider.g.updateMatrixWorld(true);const from=new T.Vector3(0,.75,-1.35).applyMatrix4(spider.g.matrixWorld),to=robot.localToWorld(new T.Vector3(0,.28,0)),u=Math.min(1,(t-6.1)/.4);const end=from.clone().lerp(to,u),a=geo.attributes.position;a.setXYZ(0,from.x,from.y,from.z);a.setXYZ(1,end.x,end.y,end.z);a.needsUpdate=true;shot.visible=t<7.2;binding.visible=t>=6.5;}
  if(t>=6.6){const fall=Math.min(1,(t-6.6)/.85),e=fall*fall*(3-2*fall);robot.position.y=.22*e;robot.rotation.x=e*Math.PI/2;state=fall===1?'fallen':'falling';}
 }
 return{update,shot,binding,get state(){return state;}};
}
