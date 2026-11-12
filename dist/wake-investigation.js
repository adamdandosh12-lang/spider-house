import * as T from './vendor/three.module.js';
import {createStoryControls,homeBlocked,storyDoor} from './story-controls.js';
import {createPlayerPhone} from './player-phone.js';
export function createWakeInvestigation({home,camera,homeDecor,line,showNews,lamp}){
 const control=createStoryControls(camera),v=(x,y,z)=>new T.Vector3(x,y,z);let stage='idle',time=0,complete=false;
 const c=document.createElement('canvas');c.width=384;c.height=720;const ctx=c.getContext('2d');ctx.fillStyle='#10202d';ctx.fillRect(0,0,384,720);ctx.fillStyle='#f3f4e8';ctx.textAlign='center';ctx.direction='rtl';ctx.font='72px Arial';ctx.fillText('01:00',192,155);ctx.font='24px Arial';['יחידה 08','אדם… אני עדיין כאן.','בבית של העכביש.','הסוללה עומדת להיגמר.'].forEach((s,i)=>ctx.fillText(s,192,270+i*65));
 const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const held=createPlayerPhone({texture});camera.add(held.phone);held.phone.position.set(.025,-.07,-.48);held.phone.visible=false;
 const desk=new T.Group();desk.position.set(-2.7,0,4.3);home.add(desk);const wood=new T.MeshStandardMaterial({color:0x6b5541});function box(w,h,d,x,y,z){const o=new T.Mesh(new T.BoxGeometry(w,h,d),wood);o.position.set(x,y,z);desk.add(o);return o;}box(.9,.08,.7,0,.85,0);for(const x of [-.35,.35])for(const z of [-.25,.25])box(.07,.8,.07,x,.4,z);
 const resting=createPlayerPhone({texture});desk.add(resting.phone);resting.phone.position.set(0,.91,0);resting.phone.rotation.x=-Math.PI/2;resting.phone.scale.setScalar(1.2);resting.grip.hide();const door=storyDoor(T,home,0,7.9);door.visible=false;
 function change(next,text){stage=next;time=0;if(text)line(text);}
 function update(dt,input={}){if(stage==='idle'){control.place(-5,1,4.6,v(-5,2.9,3));door.visible=true;lamp.intensity=10;home.background.set(0x0c1520);change('asleep');}time+=dt;
  const free=['news-walk','phone-walk','leave'].includes(stage);control.update(dt,input,free,homeBlocked);
  if(stage==='rising'){camera.position.set(-5+2.2*Math.min(1,time),1+.65*Math.min(1,time),4.6);if(time>1){control.place(-2.8,1.65,4.6,v(-5,1.5,-3.55));change('news-walk','אני: אני צריך לראות חדשות.');}}
  if(stage==='news'){camera.position.set(-5,1.18,-3.65);control.face(v(-5,1.65,-6.9));showNews(time);}
  if(stage==='phone'){held.phone.visible=true;held.grip.hold(1);if(time>3&&time-dt<=3)line('אני: טוב, אני אלך להציל את הרובוט.');}
 }
 function interact(){if(stage==='asleep'){change('rising');return;}if(stage==='news-walk'&&control.near(-5,-3.55,2.6)){change('news');return;}if(stage==='news'&&time>10){control.place(-2.7,1.65,-3.6,v(-2.7,1,4.3));change('phone-walk');return;}if(stage==='phone-walk'&&control.near(-2.7,4.3)){resting.phone.visible=false;change('phone','01:00 בלילה · הודעה מיחידה 08');return;}if(stage==='phone'&&time>3){held.phone.visible=false;held.grip.hide();change('leave');return;}if(stage==='leave'&&control.near(0,7)){door.rotation.y=-1.35;door.visible=false;complete=true;}}
 function hint(){return {asleep:'E / פעולה · קום מהמיטה',rising:'קם מהמיטה…','news-walk':control.near(-5,-3.55,2.6)?'E / פעולה · שב וצפה בחדשות':'לך לספה וצפה בחדשות',news:time>10?'E / פעולה · קום ולך לקחת את הטלפון':'החדשות מציגות את מה שצילמת','phone-walk':control.near(-2.7,4.3)?'E / פעולה · הרם את הטלפון':'לך לקחת את הטלפון מהשולחן ליד המיטה',phone:time>3?'E / פעולה · הכנס את הטלפון לכיס':'01:00 · קרא את ההודעה מהרובוט',leave:control.near(0,7)?'E / פעולה · צא להציל את הרובוט':'לך לדלת וצא להציל את הרובוט'}[stage]||'';}
 return{update,interact,hint,resize(a){held.phone.scale.setScalar(a<1?.78:1);},reset(){stage='idle';time=0;complete=false;door.visible=false;held.phone.visible=false;held.grip.hide();resting.phone.visible=true;control.reset();},get complete(){return complete;},get active(){return stage!=='idle'&&!complete;},debug(){return{stage,time,camera,phone:held.phone,resting:resting.phone,door,complete};}};
}
