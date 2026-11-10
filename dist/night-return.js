import * as T from './vendor/three.module.js';
import {createPlayerPhone} from './player-phone.js';
import {floorAt} from './house-world.js';
export const NIGHT_LINES={decision:'אני: טוב, אני אלך להציל את הרובוט.',arrival:'אני: חזרתי לבית של העכביש. אני חייב למצוא את הרובוט.',found:'אני: מצאתי אותך. תחזיק מעמד, אני אעזור לך.',robot:'רובוט: אדם… חזרת בשבילי. אני עדיין כאן.'};
export function createNightReturn({scene,camera,home,homeCamera,homeDecor,lamp,robotRoom,spider,line,blocked,prepare}){
 const c=document.createElement('canvas');c.width=384;c.height=720;const x=c.getContext('2d');
 x.fillStyle='#101d27';x.fillRect(0,0,384,720);x.textAlign='center';x.fillStyle='#f5f4e9';x.font='72px Arial';x.fillText('01:00',192,150);x.font='24px Arial';x.fillStyle='#94c4b8';x.fillText('יחידה 08',192,265);x.fillStyle='#244446';x.fillRect(22,300,340,225);x.direction='rtl';x.font='24px Arial';x.fillStyle='#f1f4e7';['אדם… אני עדיין כאן.','בבית של העכביש.','הסוללה עומדת להיגמר.'].forEach((s,i)=>x.fillText(s,192,350+i*59));
 const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const phone=createPlayerPhone({texture});homeCamera.add(phone.phone);phone.phone.position.set(.025,-.07,-.48);phone.phone.visible=false;
 const web=new T.Group();web.name='Night search trail and fallen robot webs';web.visible=false;scene.add(web);const silk=new T.LineBasicMaterial({color:0xcad8d2,transparent:true,opacity:.65});
 function thread(points,m=silk){web.add(new T.Line(new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(...p))),m));}
 for(let i=0;i<28;i++){const z=-10.8+i*.065;thread([[-1,.04,z],[-.32,.54,z-.04],[.42,.57,z+.03],[1.2,.04,z+.2]]);}
 const scuff=new T.LineBasicMaterial({color:0x8d8a7a,transparent:true,opacity:.48});for(let i=0;i<32;i++)for(const side of [-1,1])thread([[side*.22,.047,8-i*.52],[side*.22+.04,.047,7.7-i*.52]],scuff);
 const beacon=new T.PointLight(0x72c2bc,.4,3);beacon.position.set(0,.5,-11.7);web.add(beacon);
 let phase='idle',time=0,phaseTime=0,started=false,complete=false,spoken='',y=0,p=0;const found=new Set(),pos=new T.Vector3(0,1.65,10.5),original={position:robotRoom.robot.position.clone(),rotation:robotRoom.robot.quaternion.clone(),visible:spider.g.visible};
 const clues=[{z:5,title:'סימני גרירה על השטיח',text:'הסימנים ממשיכים לכיוון המדרגות.'},{z:-2,title:'קורים קרועים וחתיכת מתכת',text:'זה חלק מהשריון של הרובוט. הוא עבר כאן.'},{z:-7,title:'אות חלש מהטלפון',text:'האות מגיע ליד המדרגות, לפני הכניסה למרתף.'}];
 function say(text){if(spoken!==text){spoken=text;line(text);}}
 function begin(){started=true;phase='phone';phaseTime=0;home.background.set(0x0c1520);lamp.intensity=10;homeDecor.update(1,false);homeCamera.position.set(-5,1.2,4.5);homeCamera.lookAt(-5,1.4,-3);phone.phone.visible=true;phone.grip.hold(1);say('01:00 בלילה · הודעה מיחידה 08');}
 function enter(){prepare();phase='search';phaseTime=0;pos.set(0,1.65,10.5);y=0;p=0;web.visible=true;spider.g.visible=false;robotRoom.robot.position.set(0,.31,-10);robotRoom.robot.rotation.set(-Math.PI/2,0,-.28);robotRoom.arms.forEach((arm,i)=>{arm.visible=true;arm.rotation.set(-.1,0,i?-.1:.1);});robotRoom.legs.forEach(({leg,knee})=>{leg.rotation.set(0,0,0);knee.rotation.set(.06,0,0);});robotRoom.wake();camera.position.copy(pos);say(NIGHT_LINES.arrival);}
 function update(t,dt,input={}){time=t;if(!started)begin();phaseTime+=dt;if(phase==='phone'){
   phone.phone.visible=true;phone.grip.hold(1);phone.phone.rotation.z=Math.sin(t*1.3)*.008;homeCamera.position.y=1.2+Math.sin(t*.9)*.003;if(t>5)say(NIGHT_LINES.decision);if(t>=11){phone.phone.visible=false;phone.grip.hide();phase='depart';phaseTime=0;say('בדרך חזרה לבית של העכביש…');}return;
  }if(phase==='depart'){if(phaseTime>=7)enter();return;}
  if(phase==='search'){
   y-=input.lookX||0;p=T.MathUtils.clamp(p-(input.lookY||0),-1.1,1.1);const k=input.keys||{},touch=input.touch||{};let f=(k.KeyW||k.ArrowUp?1:0)-(k.KeyS||k.ArrowDown?1:0)-(touch.y||0),r=(k.KeyD||k.ArrowRight?1:0)-(k.KeyA||k.ArrowLeft?1:0)+(touch.x||0);const len=Math.max(1,Math.hypot(f,r)),speed=(k.ShiftLeft?3.7:2.55)*dt/len;const dx=(-Math.sin(y)*f+Math.cos(y)*r)*speed,dz=(-Math.cos(y)*f-Math.sin(y)*r)*speed;
   function move(nx,nz){const h=floorAt(nx,nz,pos.y-1.65);if(h!==null&&!blocked(nx,nz,.3,h))pos.set(nx,h+1.65,nz);}
   move(pos.x+dx,pos.z);move(pos.x,pos.z+dz);camera.position.copy(pos);camera.position.y+=Math.hypot(dx,dz)>.001?Math.sin(t*9)*.012:0;camera.rotation.set(p,y,0,'YXZ');beacon.intensity=.3+Math.sin(t*1.7)*.08;
  }else if(phase==='found'){camera.lookAt(0,.5,-10.8);if(phaseTime>3)say(NIGHT_LINES.robot);if(phaseTime>=8)complete=true;}
 }
 function interact(){if(phase==='phone'&&time>=5){phase='depart';phaseTime=0;phone.phone.visible=false;phone.grip.hide();return;}if(phase!=='search')return;if(Math.hypot(pos.x,pos.z+10)<2.35&&Math.abs(pos.y-1.65)<.3){phase='found';phaseTime=0;say(NIGHT_LINES.found);return;}const clue=clues.find((c,i)=>!found.has(i)&&Math.hypot(pos.x,pos.z-c.z)<1.8&&Math.abs(pos.y-1.65)<.3);if(clue){found.add(clues.indexOf(clue));say(clue.text);}}
 function hint(){if(phase==='phone')return time<5?'01:00 · הודעה מהרובוט':'E / פעולה · לצאת להציל את הרובוט';if(phase==='depart')return 'חוזר לבית המקורי · 01:00 בלילה';if(phase==='found')return 'מצאת את יחידה 08';if(phase!=='search')return '';if(Math.hypot(pos.x,pos.z+10)<2.35&&Math.abs(pos.y-1.65)<.3)return 'E / פעולה · לבדוק את הרובוט';const clue=clues.find((c,i)=>!found.has(i)&&Math.hypot(pos.x,pos.z-c.z)<1.8&&Math.abs(pos.y-1.65)<.3);return clue?'E / פעולה · '+clue.title:'חפש את הרובוט · עקוב אחרי הסימנים במסדרון';}
 function stop(){phone.phone.visible=false;phone.grip.hide();web.visible=false;spider.g.visible=original.visible;robotRoom.robot.position.copy(original.position);robotRoom.robot.quaternion.copy(original.rotation);}
 return{update,interact,hint,stop,resize(aspect){phone.phone.scale.setScalar(aspect<1?.78:1);phone.phone.position.x=aspect<1?0:.025;},reset(){stop();started=false;complete=false;phase='idle';phaseTime=0;time=0;spoken='';found.clear();},get departElapsed(){return phase==='depart'?phaseTime:0;},get phase(){return phase;},get complete(){return complete;},get camera(){return phase==='phone'?homeCamera:camera;},get searching(){return phase==='search';},debug(){return{phase,time,position:pos,phone:phone.phone,web,clues:found.size,complete};}};
}
