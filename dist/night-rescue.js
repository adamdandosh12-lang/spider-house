import * as T from './vendor/three.module.js';
import {createPlayerHand} from './player-hand.js';
export const RESCUE_LINES={key:'רובוט: המפתח בכיס שלי. במרתף יש ארון חשמל עם סוללת חירום. אל תשאיר אותי כאן.',battery:'אני: מצאתי את הסוללה. אני חוזר אליך.',stand:'רובוט: הרגל שלי נפגעה. אני לא יכול לרוץ.',promise:'אני: אז נצא לאט. אני לא משאיר אותך.',safe:'רובוט: הפעם אתה הצלת אותי. תודה, אדם.'};
export function createNightRescue({scene,camera,robotRoom,line,sound=()=>{}}){
 const root=new T.Group();root.name='Night rescue emergency cabinet';root.visible=false;scene.add(root);
 const mat=(c,metal=0)=>new T.MeshStandardMaterial({color:c,metalness:metal,roughness:.65});const steel=mat(0x52615c,.6),dark=mat(0x172726),gold=mat(0xc7a754,.7),cellMat=mat(0x2b696a,.5);
 function box(p,w,h,d,m,x=0,y=0,z=0){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);p.add(o);return o;}
 // The cabinet is against the back wall; approach and interaction remain in the open aisle.
 const cabinet=new T.Group();cabinet.position.set(-19.2,-4.2,-39.3);root.add(cabinet);box(cabinet,1.2,1.65,.42,steel,0,.825,0);box(cabinet,1.05,1.4,.02,dark,0,.85,.22);
 const door=new T.Group();door.position.set(-.6,0,.245);cabinet.add(door);box(door,1.2,1.65,.045,steel,.6,.825,0);box(door,.06,.24,.05,gold,1.02,.9,.04);
 for(let i=0;i<6;i++)box(door,.5,.015,.012,dark,.58,1.12+i*.055,.03);
 const battery=new T.Group();battery.name='Night emergency battery';battery.position.set(0,.8,.29);cabinet.add(battery);box(battery,.4,.28,.22,cellMat);for(const x of [-.13,.13])box(battery,.055,.04,.06,gold,x,.16,0);const charge=box(battery,.26,.045,.01,new T.MeshBasicMaterial({color:0x94dcc1}),0,0,.12);
 const key=new T.Group();key.name='Robot pocket emergency key';key.position.set(.28,.57,-10.4);root.add(key);const ring=new T.Mesh(new T.TorusGeometry(.055,.012,6,18),gold);key.add(ring);box(key,.023,.16,.025,gold,0,-.12,0);box(key,.06,.025,.025,gold,.02,-.18,0);
 const lamp=new T.PointLight(0x82c9b6,1.5,5);lamp.position.set(-19.2,-2,-38.8);root.add(lamp);
 const hand=createPlayerHand(T,camera);let stage='idle',timer=0,reach=0,doorOpen=0,knocks=0,trail=[],last=null;const rob=robotRoom.robot;
 const attachedWebs=[];rob.traverse(o=>{if(o.isLineSegments&&o.material?.opacity===.5)attachedWebs.push(o);});
 function near(pos,x,z,y=0,r=2){return Math.hypot(pos.x-x,pos.z-z)<r&&Math.abs(pos.y-1.65-y)<.3;}
 function robotWorld(){return rob.getWorldPosition(new T.Vector3());}
 function activate(){root.visible=true;stage='key';timer=0;line(RESCUE_LINES.key);}
 function update(dt,pos){if(stage==='idle')return;timer+=dt;if(reach>0){reach=Math.max(0,reach-dt);hand.pose(1-reach/.85);}else hand.reset();door.rotation.y=T.MathUtils.damp(door.rotation.y,doorOpen?-1.9:0,5,dt);
  if(stage==='battery'&&timer>1&&knocks<3&&timer>1+knocks*.65){sound();knocks++;lamp.intensity=.15;}else lamp.intensity=T.MathUtils.damp(lamp.intensity,1.5,4,dt);
  if(stage==='rising'){const u=Math.min(1,timer/4),s=u*u*(3-2*u);rob.rotation.set(-Math.PI/2*(1-s),0,-.28*(1-s));rob.position.y=.31*(1-s);robotRoom.legs.forEach(({leg,knee},i)=>{leg.rotation.x=-Math.sin(u*Math.PI)*.55;knee.rotation.x=Math.sin(u*Math.PI)*.9+(i?.08:0);});if(timer>=4){stage='escort';timer=0;trail=[new T.Vector3(pos.x,pos.y-1.65,pos.z)];last=trail[0].clone();line(RESCUE_LINES.stand);}}
  if(stage==='escort'){
   if(timer>4&&timer-dt<=4)line(RESCUE_LINES.promise);
   const target=new T.Vector3(pos.x,pos.y-1.65,pos.z);if(!last||target.distanceTo(last)>.18){trail.push(target);last=target.clone();}
   const rp=robotWorld(),head=trail[0];let moving=false;
   if(head&&(trail.length>1||rp.distanceTo(target)>1.4)){const dist=rp.distanceTo(head),step=Math.min(dist,dt*.95);if(dist>.001){rp.lerp(head,step/dist);const local=rob.parent.worldToLocal(rp.clone());rob.position.copy(local);rob.rotation.y=Math.atan2(head.x-rp.x,head.z-rp.z);moving=true;}if(dist<.14)trail.shift();}
   robotRoom.legs.forEach(({leg,knee},i)=>{leg.rotation.x=moving?Math.sin(timer*4+i*Math.PI)*(i?.12:.22):0;knee.rotation.x=.08+(moving?Math.max(0,Math.sin(timer*4+i*Math.PI))*.2:0);});robotRoom.arms.forEach((a,i)=>a.rotation.x=moving?-Math.sin(timer*4+i*Math.PI)*.1:0);
  }
 }
 function interact(pos){if(stage==='key'&&near(pos,0,-10)){stage='cabinet';key.visible=false;reach=.85;line('אני: לקחתי את המפתח. ארון החשמל נמצא בקיר האחורי של המרתף.');return true;}
  if(stage==='cabinet'&&near(pos,-19.2,-38,-4.2,2.1)){doorOpen=1;stage='battery';timer=0;reach=.85;line('הארון נפתח. סוללת החירום עדיין טעונה.');return true;}
  if(stage==='battery'&&timer>2.5&&near(pos,-19.2,-38,-4.2,2.1)){battery.visible=false;stage='return';reach=.85;line(RESCUE_LINES.battery);return true;}
  if(stage==='return'&&near(pos,0,-10)){stage='cut';reach=.85;timer=0;line('E / פעולה · חתוך את הקורים ושחרר את יחידה 08');return true;}
  if(stage==='cut'&&near(pos,0,-10)){stage='rising';timer=0;reach=.85;attachedWebs.forEach(o=>o.visible=false);line('הקורים נקרעו. מחבר את הסוללה…');return true;}
  if(stage==='escort'&&near(pos,0,12,0,2)&&robotWorld().distanceTo(new T.Vector3(0,0,11))<3){stage='safe';timer=0;line(RESCUE_LINES.safe);return true;}return false;
 }
 function hint(pos){const action='E / פעולה · ';switch(stage){case'key':return near(pos,0,-10)?action+'קח את המפתח מכיס הרובוט':'המפתח בכיס הרובוט';case'cabinet':return near(pos,-19.2,-38,-4.2,2.1)?action+'פתח את ארון החשמל':'רד במדרגות הספרייה למרתף · ארון החשמל בקיר האחורי';case'battery':return timer<2.5?'שלוש נקישות מעליך…':action+'קח את סוללת החירום';case'return':return near(pos,0,-10)?action+'הכן את הרובוט לתיקון':'הסוללה אצלך · חזור לרובוט ליד המדרגות';case'cut':return action+'שחרר את הקורים וחבר סוללה';case'rising':return'יחידה 08 חוזר לפעולה…';case'escort':return near(pos,0,12)?action+'צאו יחד · המתן לרובוט ליד הדלת':'הובל את הרובוט לדלת הכניסה · הוא הולך לאט';case'safe':return'יצאתם ביחד';default:return'';}}
 function reset(){stage='idle';timer=0;reach=0;knocks=0;doorOpen=0;door.rotation.y=0;key.visible=battery.visible=true;root.visible=false;trail=[];last=null;hand.reset();attachedWebs.forEach(o=>o.visible=true);}
 return{activate,update,interact,hint,reset,blocked(x,z,y){return root.visible&&y< -3&&Math.abs(x+19.2)<.9&&Math.abs(z+39.3)<.55;},get stage(){return stage;},get complete(){return stage==='safe'&&timer>5;},get free(){return !['rising','safe'].includes(stage);},debug(){return{stage,cabinet,battery,key,door,root};}};
}
