import * as T from './vendor/three.module.js';
import {createStoryControls} from './story-controls.js';
import {createPlayerHand} from './player-hand.js';
export function createCarBoarding({scene,camera,car}){
 const controls=createStoryControls(camera),hand=createPlayerHand(T,camera);let stage='idle',time=0,opening=0;
 function update(dt,input={}){if(stage==='idle'){stage='open';scene.add(camera);controls.place(6,1.65,8.8,new T.Vector3(7,1.1,7));}time+=dt;car.g.position.set(8,0,7);car.g.rotation.set(0,0,0);hand.reset();
  controls.update(dt,input,stage==='open'||stage==='enter',(x,z)=>x<4.5||x>11||z<4||z>12||(x>6.65&&x<9.4&&z>4.4&&z<9.6));opening=T.MathUtils.damp(opening,['enter','close'].includes(stage)?1:0,7,dt);car.openDoor(opening);
  if(stage==='enter'&&time<.85)hand.pose(time/.85);
  if(stage==='close'||stage==='closing'){car.g.updateMatrixWorld(true);camera.position.copy(car.g.localToWorld(new T.Vector3(-.42,1.42,.3)));camera.quaternion.copy(car.g.quaternion);}
  if(stage==='closing'){hand.pose(Math.min(1,time/.85));if(time>.85&&opening<.02)stage='done';}
 }
 function near(){return controls.near(6.4,7.3,2.8);}
 function interact(){if(stage==='open'&&near()){stage='enter';time=0;hand.grip();}else if(stage==='enter'&&near()&&opening>.8){stage='close';time=0;}else if(stage==='close'){stage='closing';time=0;}}
 return{update,interact,hint(){return stage==='open'?(near()?'E / פעולה · פתח את דלת הלמבורגיני':'גש לדלת הנהג של הלמבורגיני'):stage==='enter'?(near()?'E / פעולה · היכנס למכונית':'גש לדלת הנהג הפתוחה'):stage==='close'?'E / פעולה · סגור את הדלת וצאו הביתה':'סוגר את דלת המכונית…';},reset(){stage='idle';time=opening=0;hand.reset();},get complete(){return stage==='done';},get active(){return stage!=='idle'&&stage!=='done';},debug(){return{stage,camera,opening};}};
}
