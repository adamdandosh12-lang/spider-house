import {createStoryControls,homeBlocked,storyDoor} from './story-controls.js';
import {buildNewsSofa} from './morning-news.js';
import * as T from './vendor/three.module.js';
import {createSpider} from './spider-model.js';
import {createCaptureScare} from './capture-scare.js';
import {createPlayerHand} from './player-hand.js';
export const HOME_RETURN_LINES={repair:'אני: אני אטפל ברגל שלך. רגע, אני מביא את הכלים.',missing:'אני: רובוט? איפה אתה?',outside:'רובוט: אני פה בחוץ. מצאתי משהו על המכונית שלך.',web:'אני: רגע… מה זה על הדלת של המכונית?',warning:'רובוט: הקור הזה טרי. אדם, תסגור את הדלת.',blackout:'אני: כל הרחוב החשיך. מישהו בבית ממול מאותת לנו.',tv:'אני: הטלוויזיה מראה את הבית שלי. זו מצלמת האבטחה!',roof:'רובוט: תסתכל על הגג. הוא היה מאחורינו כל הזמן.',followed:'רובוט: הוא עקב אחרינו. אנחנו חייבים למצוא את השכן ולברוח.',back:'אני: טוב, בוא נחזור הביתה. נסגור את הדלת.',window:'אני: אני רגע הולך לבדוק את האוטו דרך החלון.',scream:'אני: אההה!',help:'רובוט: אדם! מה קרה לך?',answer:'אני: ראיתי את העכביש! הוא פה, בחלון!'};
const V=(x,y,z)=>new T.Vector3(x,y,z),ease=u=>{u=T.MathUtils.clamp(u,0,1);return u*u*(3-2*u);};
export function createHomeReturn({home,outside,homeDecor,car,robot,lamp,line,sound=()=>{},scareSound=()=>{}}){
 const camera=new T.PerspectiveCamera(60,1,.06,180);home.add(camera);const hand=createPlayerHand(T,camera),scare=createCaptureScare();
 const indoor=new T.Group(),outdoor=new T.Group();home.add(indoor);outside.add(outdoor);indoor.visible=outdoor.visible=false;
 const streetRobot=robot.clone(true);streetRobot.scale.setScalar(1);streetRobot.position.set(5,0,8);streetRobot.rotation.set(0,0,0);streetRobot.getObjectByName('Escape fight arms')?.removeFromParent();outdoor.add(streetRobot);const clone=robot.clone(true);clone.name='Recovered robot at player home';clone.scale.setScalar(1);clone.getObjectByName('Escape fight arms')?.removeFromParent();indoor.add(clone);
 const coat=new T.MeshStandardMaterial({color:0x9ba8a3,metalness:.65,roughness:.5}),wood=new T.MeshStandardMaterial({color:0x67513e,roughness:.9}),black=new T.MeshStandardMaterial({color:0x1b252a}),silver=new T.MeshStandardMaterial({color:0x9fa9a7,metalness:.7,roughness:.3});
 function box(parent,w,h,d,mat,x,y,z){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m;}
 const table=new T.Group();indoor.add(table);table.position.set(3,0,3);box(table,1.7,.1,.9,wood,0,.78,0);for(const x of [-.7,.7])for(const z of [-.32,.32])box(table,.08,.73,.08,wood,x,.365,z);
 const tools=new T.Group();tools.name='Robot repair tools';table.add(tools);box(tools,.55,.16,.32,black,0,.9,0);for(const x of [-.18,.15]){box(tools,.045,.03,.3,silver,x,1.005,0);box(tools,.13,.03,.075,silver,x,1.005,-.15);}
 const stool=new T.Group();stool.position.set(1,0,0);indoor.add(stool);box(stool,.7,.12,.65,wood,0,.62,0);for(const x of [-.28,.28])for(const z of [-.25,.25])box(stool,.07,.56,.07,wood,x,.28,z);
 const securityTarget=new T.WebGLRenderTarget(640,360),windowTarget=new T.WebGLRenderTarget(640,360),securityCamera=new T.PerspectiveCamera(64,16/9,.1,100),windowCamera=new T.PerspectiveCamera(55,16/9,.1,100);
 securityCamera.position.set(1,5,20);securityCamera.lookAt(8,2,10);windowCamera.position.set(4,1.7,11);windowCamera.lookAt(8,1,7);
 const monitor=new T.Mesh(new T.PlaneGeometry(2.44,1.37),new T.MeshBasicMaterial({map:securityTarget.texture}));monitor.position.z=.10;homeDecor.tv.add(monitor);monitor.visible=false;
 const windowGroup=new T.Group();windowGroup.name='Home window looking onto driveway';windowGroup.position.set(8.9,1.9,2);windowGroup.rotation.y=-Math.PI/2;indoor.add(windowGroup);box(windowGroup,3.2,1.95,.10,wood,0,0,0);const pane=new T.Mesh(new T.PlaneGeometry(2.95,1.7),new T.MeshBasicMaterial({map:windowTarget.texture}));pane.position.z=.06;windowGroup.add(pane);for(const x of [-1.49,0,1.49])box(windowGroup,.065,1.8,.08,wood,x,0,.1);for(const y of [-.87,.87])box(windowGroup,3,.07,.1,wood,0,y,.1);
 const silk=[];for(let i=0;i<18;i++){const a=i/18*Math.PI*2;silk.push(-1.04,1.17,.2,-1.04,1.17+Math.cos(a)*.6,.2+Math.sin(a)*.6);}for(let r=.15;r<.65;r+=.12)for(let j=0;j<30;j++){const a=j/30*Math.PI*2,b=(j+1)/30*Math.PI*2;silk.push(-1.045,1.17+Math.cos(a)*r,.2+Math.sin(a)*r,-1.045,1.17+Math.cos(b)*r,.2+Math.sin(b)*r);}const web=new T.LineSegments(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(silk,3)),new T.LineBasicMaterial({color:0xd1d9cb,transparent:true,opacity:.8}));car.g.add(web);web.visible=false;
 const watcher=createSpider(outdoor);watcher.g.position.set(13,4.15,14.7);watcher.g.rotation.y=0;watcher.g.scale.setScalar(.7);
 const signal=new T.SpotLight(0xe7f3d1,0,35,.14,.4);signal.position.set(-11.3,2.15,-1.9);signal.target.position.set(4,1,9);outdoor.add(signal,signal.target);
 const beacon=new T.Group();beacon.name='Neighbour visibly signalling from window';beacon.position.copy(signal.position);outdoor.add(beacon);
 const beamMat=new T.MeshBasicMaterial({color:0xe5f4d6,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide});
 const beam=new T.Mesh(new T.ConeGeometry(1.5,17,20,1,true),beamMat);beam.position.copy(signal.position).lerp(signal.target.position,.5);beam.quaternion.setFromUnitVectors(V(0,1,0),signal.position.clone().sub(signal.target.position).normalize());outdoor.add(beam);
 const lens=new T.Mesh(new T.SphereGeometry(.09,16,10),new T.MeshBasicMaterial({color:0xeaffd6}));beacon.add(lens);
 box(beacon,.26,.45,.17,black,-.12,-.3,.08);const head=new T.Mesh(new T.SphereGeometry(.13,16,12),coat);head.position.set(-.12,.05,.08);beacon.add(head);
 const gripLines=[];for(const side of [-1,1])for(const z of [13.3,16])gripLines.push(13+side*.5,4.7,14.7,13+side*2.3,4.02,z);
 const tethers=new T.LineSegments(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(gripLines,3)),new T.LineBasicMaterial({color:0xcbd4d1,transparent:true,opacity:.65}));tethers.name='Tension silk anchored to roof tiles';outdoor.add(tethers);
 const roofHeight=x=>5-Math.abs(x-13)*1.5/3.5;
 function roofGrip(foot,leg,breath){foot.y=(roofHeight(13+foot.x*.7)-4.15)/.7-breath+.025;}
 const walkingLegs=[];streetRobot.traverse(o=>{if(o.isGroup&&Math.abs(o.position.y-.96)<.01)walkingLegs.push(o);});
 function walkRobot(from,to,u){streetRobot.position.copy(from).lerp(to,ease(u));streetRobot.rotation.y=Math.atan2(to.x-from.x,to.z-from.z);walkingLegs.forEach((l,i)=>l.rotation.x=Math.sin(clock*7+i*Math.PI)*.23*Math.sin(Math.PI*Math.min(1,u)));}
 function signalPulse(on){const pulse=on&&clock%2.8<1.35&&Math.floor(clock/.22)%2===0;signal.intensity=pulse?40:0;lens.visible=pulse;beamMat.opacity=pulse?.075:0;}

 const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.fillStyle='#111b20';x.fillRect(0,0,512,128);x.fillStyle='#d3ded8';x.font='30px monospace';x.fillText('CAM 02  /  REC',15,70);const stamp=new T.Mesh(new T.PlaneGeometry(1,.25),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true}));stamp.position.set(-.65,.53,.12);homeDecor.tv.add(stamp);stamp.visible=false;

 const neighbour=new T.Scene();neighbour.background=new T.Color(0x17232b);neighbour.add(new T.HemisphereLight(0xc6dbe4,0x554335,1.7));const nl=new T.PointLight(0xffd9aa,35,20);nl.position.set(0,3,0);neighbour.add(nl);
 const nr=new T.Group();neighbour.add(nr);box(nr,18,.15,17,wood,0,-.08,0);for(const sx of [-9,9])box(nr,.15,3.5,17,wood,sx,1.75,0);box(nr,18,3.5,.15,wood,0,1.75,-8);buildNewsSofa(nr);
 const neighbourTV=homeDecor.tv.clone(true);neighbourTV.name='Neighbour security television';nr.add(neighbourTV);const neighbourMonitor=new T.Mesh(monitor.geometry,monitor.material);neighbourMonitor.position.z=.14;neighbourTV.add(neighbourMonitor);const neighbourStamp=stamp.clone();neighbourStamp.position.z=.15;neighbourStamp.visible=true;neighbourTV.add(neighbourStamp);
 const neighbourRobot=streetRobot.clone(true);nr.add(neighbourRobot);
 const neighbourYardDoor=storyDoor(T,outdoor,0,0);neighbourYardDoor.position.set(-10.4,0,.65);neighbourYardDoor.rotation.y=Math.PI/2;const neighbourYardHinge=new T.Group();neighbourYardHinge.position.copy(neighbourYardDoor.position);outdoor.add(neighbourYardHinge);neighbourYardDoor.position.set(0,0,0);neighbourYardHinge.add(neighbourYardDoor);
 const homeDoor=storyDoor(T,indoor,0,7.9),yardDoor=storyDoor(T,outdoor,13,12.8),neighbourDoor=storyDoor(T,nr,0,7.9);
 for(const [cx,w]of [[-4.8,8.2],[4.8,8.2]]){box(indoor,w,3.5,.15,wood,cx,1.75,8);box(nr,w,3.5,.15,wood,cx,1.75,8);}
 let clock=0,lastWindow=-1,lastSecurity=-1,stage='idle',time=0,last='',complete=false,activeScene=home,activeCamera=camera,zone='home',animation=null,picked=false,missingSaid=false,leftLook=false,rightLook=false,windowYaw=0,pickupTime=0;
 const controls=createStoryControls(camera),lights=outside.children.filter(o=>o.isLight).map(o=>[o,o.intensity]),initialLamp=lamp.intensity;
 const legs=[];clone.traverse(o=>{if(o.isGroup&&Math.abs(o.position.y-.96)<.01)legs.push(o);});
 function say(text){if(last!==text){last=text;line(text);}}
 function change(next,text){stage=next;time=0;if(text)say(text);}
 function place(where,x,z,target){zone=where;activeScene=where==='yard'?outside:where==='neighbour'?neighbour:home;activeScene.add(camera);controls.place(x,1.65,z,target);}
 function begin(){indoor.visible=outdoor.visible=true;web.visible=true;car.g.position.set(8,0,7);car.g.rotation.set(0,0,0);car.openDoor(0);clone.position.set(1,-.35,0);clone.rotation.set(0,0,0);legs.forEach(l=>l.rotation.x=-1.2);lamp.intensity=35;place('home',1,2.6,V(1,1.1,0));change('tools',HOME_RETURN_LINES.repair);}
 function blocked(x,z){if(zone==='yard'){if(x< -10.3||x>16||z< -5||z>12.4)return true;return x>6.6&&x<9.4&&z>4.4&&z<9.6;}if(homeBlocked(x,z))return true;return zone==='home'&&x>1.9&&x<4.1&&z>2.3&&z<3.7;}
 function doorAction(pivot,opening,done){if(animation)return;animation={t:0,pivot,axis:pivot===car.door?'x':'y',from:pivot.rotation[pivot===car.door?'x':'y'],to:opening?(pivot===car.door?-1.15:-1.35):0,done};}
 function follow(r,dt){const dx=camera.position.x-r.position.x,dz=camera.position.z-r.position.z,d=Math.hypot(dx,dz);if(d>2.2){const v=Math.min(d-2.2,dt*3.8);const nx=r.position.x+dx/d*v,nz=r.position.z+dz/d*v;if(!blocked(nx,nz)||!blocked(r.position.x,nz)||!blocked(nx,r.position.z)){if(!blocked(nx,r.position.z))r.position.x=nx;if(!blocked(r.position.x,nz))r.position.z=nz;r.position.y=0;r.rotation.y=Math.atan2(dx,dz);r.traverse(o=>{if(o.isGroup&&Math.abs(o.position.y-.96)<.01)o.rotation.x=Math.sin(clock*8+(o.position.x>0?Math.PI:0))*.25;});}}else r.traverse(o=>{if(o.isGroup&&Math.abs(o.position.y-.96)<.01)o.rotation.x=0;});}
 function update(dt,input={}){if(stage==='idle')begin();time+=dt;clock+=dt;activeScene=zone==='yard'?outside:zone==='neighbour'?neighbour:home;activeCamera=camera;if(camera.parent!==activeScene)activeScene.add(camera);hand.reset();
  const frozen=!!animation||['tv','window-look','scare','fall','help','aftermath'].includes(stage);if(!['scare','fall','help','aftermath'].includes(stage))controls.update(dt,input,!frozen,blocked);
  if(animation){animation.t+=dt;const a=animation,u=ease(a.t/.85);a.pivot.rotation[a.axis]=T.MathUtils.lerp(a.from,a.to,u);hand.pose(Math.min(1,a.t/.85));if(a.t>=.85){animation=null;a.done();}}
  if(stage==='return-tools'&&!missingSaid&&controls.near(1,0,2.5)){missingSaid=true;say(HOME_RETURN_LINES.missing);change('calling');}
  if(stage==='calling'&&time>2.6)change('find-robot',HOME_RETURN_LINES.outside);
  streetRobot.visible=zone==='yard';neighbourRobot.visible=zone==='neighbour';
  if(zone==='yard'&&['neighbour','return-home'].includes(stage))follow(streetRobot,dt);if(zone==='neighbour'&&['sofa','leave-neighbour'].includes(stage))follow(neighbourRobot,dt);if(pickupTime>0){pickupTime=Math.max(0,pickupTime-dt);hand.pose(1-pickupTime/.65);}
  if(stage==='find-robot'&&zone==='yard'&&controls.near(5,8,2.4))change('inspect-car',HOME_RETURN_LINES.web);
  if(stage==='blackout'){lights.forEach(([l,v])=>l.intensity=T.MathUtils.lerp(v,v*.15,ease(time)));if(time>3)change('neighbour',HOME_RETURN_LINES.blackout);}
  signalPulse(['blackout','neighbour'].includes(stage));if(['blackout','neighbour'].includes(stage)&&Math.hypot(streetRobot.position.x-camera.position.x,streetRobot.position.z-camera.position.z)<2.5)streetRobot.lookAt(-11.3,0,-1.9);
  if(stage==='tv'){camera.position.set(-5,1.18,-3.65);controls.face(V(-5,1.65,-6.9));if(time>4)securityCamera.lookAt(13,4.7,14.7);if(time>5&&time<5+dt)say(HOME_RETURN_LINES.roof);}
  if(stage==='home-talk'&&controls.near(1,0,2.8)){clone.lookAt(camera.position.x,0,camera.position.z);sound('scratch');change('heard','אני: שמעת את הרעש הזה?');}
  if(stage==='heard'&&time>2.5)change('robot-no','רובוט: לא. לא שמעתי.');
  if(stage==='robot-no'&&time>2)change('window',HOME_RETURN_LINES.window);
  if(stage==='window-look'){const delta=Math.atan2(Math.sin(controls.yaw-windowYaw),Math.cos(controls.yaw-windowYaw));if(delta>.16)leftLook=true;if(delta<-.16)rightLook=true;if(input.keys?.KeyA||input.keys?.ArrowLeft){controls.face(V(8.9,1.9,3.4));leftLook=true;}if(input.keys?.KeyD||input.keys?.ArrowRight){controls.face(V(8.9,1.9,.6));rightLook=true;}if(leftLook&&rightLook&&time>1.5){change('scare',HOME_RETURN_LINES.scream);scareSound();}}
  if(stage==='scare'){activeScene=scare.scene;activeCamera=scare.camera;scare.update(time,camera.aspect);if(time>1.35)change('fall');}
  if(stage==='fall'){camera.position.set(6.8,1.65-1.3*ease(time/.7),2-1.4*ease(time/.7));camera.lookAt(8,2.5,2);camera.rotation.z=-.55*ease(time/.7);clone.position.lerp(V(6,0,1.5),Math.min(1,dt*1.3));clone.rotation.y=1.1;if(time>2)change('help',HOME_RETURN_LINES.help);}
  if(stage==='help'){camera.lookAt(6,1.8,1.5);if(time>3.5)change('aftermath',HOME_RETURN_LINES.answer);}if(stage==='aftermath'&&time>5)complete=true;
  watcher.animate(clock,dt,false,'patrol',null,null,null,0,roofGrip);
 }
 function interact(){if(animation)return;
  if(stage==='tools'&&controls.near(3,3)){pickupTime=.65;hand.grip();tools.visible=false;picked=true;clone.visible=false;change('return-tools');return;}
  if(stage==='find-robot'&&zone==='home'&&controls.near(0,7)){doorAction(homeDoor,true,()=>{place('yard',13,11.5,V(5,1.5,8));yardDoor.rotation.y=-1.35;});return;}
  if(stage==='inspect-car'&&controls.near(6.4,7.3,2.8)){doorAction(car.door,true,()=>change('close-door',HOME_RETURN_LINES.warning));return;}
  if(stage==='close-door'&&controls.near(6.4,7.3,2.8)){doorAction(car.door,false,()=>{homeDoor.rotation.y=yardDoor.rotation.y=0;change('blackout');});return;}
  if(stage==='neighbour'&&controls.near(-9.5,0,2)){doorAction(neighbourYardHinge,true,()=>{place('neighbour',0,6.8,V(-5,1.5,-3.55));neighbourRobot.position.set(1,0,5.8);change('sofa');});return;}
  if(stage==='sofa'&&controls.near(-5,-3.55,2.6)){neighbourRobot.position.set(-3.9,-.35,-3.65);neighbourRobot.rotation.y=Math.PI;neighbourRobot.traverse(o=>{if(o.isGroup&&Math.abs(o.position.y-.96)<.01)o.rotation.x=-1.2;});change('tv',HOME_RETURN_LINES.tv);return;}
  if(stage==='tv'&&time>10){controls.place(-2.7,1.65,-3.6,V(0,1.5,7));change('leave-neighbour',HOME_RETURN_LINES.back);return;}
  if(stage==='leave-neighbour'&&controls.near(0,7)){doorAction(neighbourDoor,true,()=>{place('yard',-9.5,.4,V(13,1.5,12));streetRobot.position.set(-8.5,0,1.5);change('return-home');});return;}
  if(stage==='return-home'&&controls.near(13,12)){doorAction(yardDoor,true,()=>{place('home',0,6.7,V(1,1.5,0));clone.visible=true;clone.position.set(1,0,0);legs.forEach(l=>l.rotation.x=0);homeDoor.rotation.y=0;yardDoor.rotation.y=0;change('home-talk');});return;}
  if(stage==='window'&&controls.near(7,2,1.8)){controls.place(6.8,1.65,2,V(8.9,1.9,2));windowYaw=controls.yaw;change('window-look');}
 }
 function hint(){const action=(near,text,go)=>near?'E / פעולה · '+text:go;
  if(animation)return 'פותח / סוגר את הדלת…';
  return ({tools:action(controls.near(3,3),'קח את הכלים','לך לקחת את הכלים מהשולחן'), 'return-tools':'חזור לרובוט עם הכלים',calling:'איפה הרובוט? חפש ליד הדלת','find-robot':zone==='home'?action(controls.near(0,7),'פתח את הדלת וצא','לך לדלת הבית וחפש את הרובוט בחוץ'):'גש לרובוט ליד המכונית','inspect-car':action(controls.near(6.4,7.3,2.8),'פתח את דלת הלמבורגיני','גש לדלת הנהג ובדוק את הקורים'),'close-door':action(controls.near(6.4,7.3,2.8),'סגור את דלת הלמבורגיני','גש לדלת הנהג וסגור אותה'),blackout:'הפסקת חשמל · הבט אל הבית המאותת',neighbour:action(controls.near(-9.5,0,2),'היכנס לבית עם הפנס','לך עם הרובוט לבית עם הפנס ממול'),sofa:action(controls.near(-5,-3.55,2.6),'שב על הספה','גש לספה ליד הטלוויזיה'),tv:time>10?'E / פעולה · קום וחזרו הביתה':'מצלמות אבטחה · הביטו בגג','leave-neighbour':action(controls.near(0,7),'צא עם הרובוט','לך לדלת של בית השכן'),'return-home':action(controls.near(13,12),'היכנס הביתה','רוץ הביתה עם הרובוט'),'home-talk':'גש לרובוט',heard:'שמעת את הרעש?', 'robot-no':'הרובוט מקשיב…',window:action(controls.near(7,2,1.8),'הבט דרך החלון','לך לחלון ובדוק את הרעש'),'window-look':'הבט שמאלה וימינה · עכבר / גרירה / A ו־D',scare:'',fall:'',help:'הרובוט ניגש אליך',aftermath:'העכביש מצא את הבית שלך'})[stage]||'';
 }
 function renderTargets(renderer){if(zone==='home'&&clock-lastWindow>.125){lastWindow=clock;renderer.setRenderTarget(windowTarget);renderer.render(outside,windowCamera);}if(zone==='neighbour'&&clock-lastSecurity>.125){lastSecurity=clock;renderer.setRenderTarget(securityTarget);renderer.render(outside,securityCamera);}renderer.setRenderTarget(null);}
 function reset(){clock=0;lastWindow=lastSecurity=-1;stage='idle';time=0;last='';complete=false;animation=null;pickupTime=0;neighbourYardHinge.rotation.y=0;zone='home';picked=missingSaid=leftLook=rightLook=false;indoor.visible=outdoor.visible=web.visible=monitor.visible=stamp.visible=false;clone.visible=tools.visible=true;hand.reset();controls.reset();homeDoor.rotation.y=yardDoor.rotation.y=neighbourDoor.rotation.y=0;lights.forEach(([l,v])=>l.intensity=v);lamp.intensity=initialLamp;securityCamera.lookAt(8,2,10);signal.intensity=0;beamMat.opacity=0;lens.visible=false;streetRobot.position.set(5,0,8);walkingLegs.forEach(l=>l.rotation.x=0);}
 return{update,interact,hint,renderTargets,reset,resize(aspect){camera.fov=aspect<1?85:60;hand.g.scale.setScalar(aspect<1?.75:1);},get active(){return stage!=='idle';},get complete(){return complete;},get scene(){return activeScene;},get camera(){return activeCamera;},debug(){return{stage,time,camera,zone,clone,tools,web,windowGroup,monitor:neighbourMonitor,complete,streetRobot,watcher,signal,beam,lens,roofHeight,picked,homeDoor,yardDoor,carDoor:car.door,hand,blocked};}};
}
