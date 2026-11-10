import {returnDrivePose} from './return-drive.js';
import {createNightReturn} from './night-return.js';
import * as T from './vendor/three.module.js';
import {createStreetCar,addStreetHouse} from './street-models.js';
import {decorateMorningHome} from './morning-home.js';
import {buildNewsSofa} from './morning-news.js';
import {createPlayerPhone} from './player-phone.js';

export const ENDING_DURATION=52;
const clamp=x=>Math.max(0,Math.min(1,x)), ease=x=>{x=clamp(x);return x*x*(3-2*x);};
export function createSequel({scene,camera,spider,robotRoom,line,blocked=()=>false,prepare=()=>{}}){
 const V=(x,y,z)=>new T.Vector3(x,y,z), robot=robotRoom.robot;
 const metal=new T.MeshStandardMaterial({color:0x9aa7a3,metalness:.75,roughness:.35});
 const dark=new T.MeshStandardMaterial({color:0x202a2e,roughness:.6});
 const armRig=new T.Group();robot.add(armRig);const arms=[];
 function box(p,w,h,d,mat,x=0,y=0,z=0){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);p.add(m);return m;}
 function bone(p,a,b,r,mat){const m=new T.Mesh(new T.CylinderGeometry(r,r,1,10),mat);p.add(m);return m;}
 for(const side of [-1,1]){const a=bone(armRig,null,null,.073,metal),b=bone(armRig,null,null,.06,metal),palm=box(armRig,.18,.13,.16,dark);for(let i=0;i<3;i++)box(palm,.035,.13,.035,metal,(i-1)*.055,-.07,.06);arms.push({side,a,b,palm});}
 function segment(m,a,b){m.position.copy(a).add(b).multiplyScalar(.5);m.scale.y=a.distanceTo(b);m.quaternion.setFromUnitVectors(V(0,1,0),b.clone().sub(a).normalize());}
 const screenTarget=new T.WebGLRenderTarget(384,216);
 const phoneModel=createPlayerPhone({texture:screenTarget.texture,landscape:true}),{phone,grip}=phoneModel,phoneScreen=phoneModel.screen;camera.add(phone);phone.position.set(.24,-.20,-.6);
 const rec=new T.Mesh(new T.SphereGeometry(.007,8,6),new T.MeshBasicMaterial({color:0xef332b}));rec.position.set(-.065,.12,.025);phone.add(rec);
 const filmCamera=new T.PerspectiveCamera(54,16/9,.1,120);
 let film=false,activeScene=scene,activeCamera=camera,phase='rescue',lastLine='',tNow=0,recorded=[],nextCapture=0;
 const outside=new T.Scene();outside.background=new T.Color(0x172334);outside.fog=new T.Fog(0x172334,35,110);
 outside.add(new T.HemisphereLight(0xa7c9eb,0x403629,2));const moon=new T.DirectionalLight(0xa6c7ff,2);moon.position.set(-8,14,5);outside.add(moon);
 const yard=new T.Group();outside.add(yard);box(yard,110,.12,230,new T.MeshStandardMaterial({color:0x253a31}),0,-.1,-55);
 box(yard,8,.04,220,new T.MeshStandardMaterial({color:0x292e34}),0,0,-55);
 for(let z=25;z> -160;z-=10)box(yard,.12,.01,4,new T.MeshStandardMaterial({color:0xc5bb97}),0,.035,z);
 box(yard,8,.05,9,new T.MeshStandardMaterial({color:0x70716b}),8,.01,8);
 addStreetHouse(yard,13,16,0x746f69,Math.PI);for(let i=0;i<9;i++){addStreetHouse(yard,-14,-i*17,0x7b827e,Math.PI/2);if(i)addStreetHouse(yard,14,-i*17,0x95826f,-Math.PI/2);}
 const car=createStreetCar(yard,0xc9a52a,'supercar');car.g.position.set(8,0,7);car.g.rotation.y=0;

 const abandoned=new T.Group();abandoned.name='Abandoned cars beside return road';abandoned.visible=false;yard.add(abandoned);
 for(const [i,x,z,color,angle]of [[0,6.2,-78,0x586560,.16],[1,-6.3,-40,0x76564d,-.3],[2,6.1,-10,0x5b6676,.4]]){
  const wreck=createStreetCar(abandoned,color,i===1?'hatchback':'sedan');wreck.g.position.set(x,0,z);wreck.g.rotation.y=angle+(i%2?Math.PI:0);wreck.g.name='Abandoned car '+(i+1);wreck.openDoor(i===1?.9:.22);wreck.wheels[0].scale.y=.6;
  wreck.g.traverse(o=>{if(!o.isMesh)return;const materials=Array.isArray(o.material)?o.material:[o.material];for(const material of materials){material.roughness=.92;if(material.emissiveIntensity)material.emissiveIntensity=0;if(material.map&&material.isMeshBasicMaterial)material.color.set(0x111a1a);}});
  const silk=[];for(let j=0;j<12;j++){silk.push(-.8,1.11+j*.035,-.91+j*.03,.78,1.16+j*.035,-.89+j*.03);}const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(silk,3));wreck.g.add(new T.LineSegments(geometry,new T.LineBasicMaterial({color:0xabb7ad,transparent:true,opacity:.52})));
  const crack=new T.BufferGeometry().setFromPoints([V(-.6,1.2,-.85),V(.08,1.45,-.64),V(.36,1.17,-.86)]);wreck.g.add(new T.Line(crack,new T.LineBasicMaterial({color:0xb8c7c5,transparent:true,opacity:.7})));
 }
 for(const side of [-1,1]){const light=new T.SpotLight(0xe5ead4,22,38,.34,.6,1.4);light.position.set(side*.62,.82,-2.12);light.target.position.set(side*.62,.2,-25);car.g.add(light,light.target);}
 const parkedWrecks=new T.Group();parkedWrecks.name='Abandoned cars outside spider house';parkedWrecks.visible=false;scene.add(parkedWrecks);for(const [i,x]of [[0,-7],[1,8]]){const clone=abandoned.children[i].clone(true);clone.position.set(x,0,19+i*4);clone.rotation.y=i?.6:-.5;parkedWrecks.add(clone);}
 const carLamp=new T.PointLight(0xffe2aa,10,20);carLamp.position.set(8,3,7);outside.add(carLamp);
 const roadCamera=new T.PerspectiveCamera(65,1,.08,180);outside.add(roadCamera);
 const home=new T.Scene();home.background=new T.Color(0x151a24);home.add(new T.HemisphereLight(0xe0e6ff,0x594938,1.7));const lamp=new T.PointLight(0xffd4a1,45,25);lamp.position.set(-3,3,0);home.add(lamp);
 const room=new T.Group();home.add(room);const wood=new T.MeshStandardMaterial({color:0x79614d,roughness:.8}),wall=new T.MeshStandardMaterial({color:0xb7b5a7});
 box(room,18,.15,17,wood,0,-.08,0);box(room,18,3.5,.15,wall,0,1.75,-8);box(room,.15,3.5,17,wall,-9,1.75,0);box(room,.15,3.5,17,wall,9,1.75,0);
 const homeDecor=decorateMorningHome(room);buildNewsSofa(room);
 const homeCamera=new T.PerspectiveCamera(60,1,.07,80);home.add(homeCamera);
 const eyelids=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0,depthTest:false}));eyelids.position.z=-.09;eyelids.renderOrder=100;homeCamera.add(eyelids);
 const newsFrame=new T.Mesh(new T.PlaneGeometry(1.45,.83),new T.MeshBasicMaterial({map:screenTarget.texture}));newsFrame.position.set(.44,.12,.079);homeDecor.tv.add(newsFrame);
 const newsCanvas=document.createElement('canvas');newsCanvas.width=768;newsCanvas.height=432;const newsCtx=newsCanvas.getContext('2d'),newsTexture=new T.CanvasTexture(newsCanvas);newsTexture.colorSpace=T.SRGBColorSpace;
 const newsOverlay=new T.Mesh(new T.PlaneGeometry(2.47,1.39),new T.MeshBasicMaterial({map:newsTexture,transparent:true}));newsOverlay.position.z=.084;homeDecor.tv.add(newsOverlay);
 function news(t){newsCtx.clearRect(0,0,768,432);newsCtx.fillStyle='#153b58';newsCtx.fillRect(0,0,290,340);newsCtx.fillStyle='#c99b80';newsCtx.beginPath();newsCtx.ellipse(145,131,40,52,0,0,Math.PI*2);newsCtx.fill();newsCtx.fillStyle='#293847';newsCtx.fillRect(85,184,120,140);newsCtx.fillStyle='#e8e4de';newsCtx.beginPath();newsCtx.moveTo(125,184);newsCtx.lineTo(165,184);newsCtx.lineTo(145,252);newsCtx.closePath();newsCtx.fill();newsCtx.fillStyle='#614237';newsCtx.fillRect(133,156,24,3+Math.abs(Math.sin(t*7))*6);newsCtx.fillStyle='#a0252b';newsCtx.fillRect(0,340,768,92);newsCtx.fillStyle='#fff';newsCtx.font='28px Arial';newsCtx.textAlign='right';newsCtx.direction='rtl';newsCtx.fillText('תיעוד דרמטי: הרובוט הציל את החוקר',745,380);newsCtx.font='18px Arial';newsCtx.fillText('חדשות מתוך עולם המשחק • גורלו של הרובוט אינו ידוע',745,415);newsTexture.needsUpdate=true;}
 function caption(s){if(s!==lastLine){lastLine=s;line(s);}}
 function look(cam,p,target){cam.position.copy(p);cam.lookAt(target);}
 const night=createNightReturn({scene,camera,home,homeCamera,homeDecor,lamp,robotRoom,spider,line:caption,blocked,prepare});
 function update(t,dt,input={}){tNow=t;abandoned.visible=t>=ENDING_DURATION&&night.phase==='depart';parkedWrecks.visible=t>=ENDING_DURATION&&['search','found'].includes(night.phase);if(t>=ENDING_DURATION){armRig.visible=false;film=false;phone.visible=false;grip.hide();eyelids.visible=false;night.update(t-ENDING_DURATION,dt,input);phase='night-'+night.phase;activeScene=night.phase==='phone'?home:scene;activeCamera=night.camera;if(night.phase==='depart'){activeScene=outside;activeCamera=roadCamera;abandoned.visible=true;const pose=returnDrivePose(night.departElapsed);car.g.position.set(pose.x,0,pose.z);car.g.rotation.set(0,pose.yaw,0);car.g.updateMatrixWorld(true);roadCamera.position.copy(car.g.localToWorld(V(-.42,1.42,.3)));roadCamera.quaternion.copy(car.g.quaternion);car.wheels.forEach(w=>w.rotation.x=-pose.distance/.38);car.steering.rotation.z=pose.steering;car.indicators.update(pose.turn,night.departElapsed,pose.speed);}return;}film=false;phone.visible=false;grip.hide();eyelids.visible=t>=33&&t<37;eyelids.material.opacity=t<36?ease((t-33)/1.2):1-ease((t-36)/1);activeScene=scene;activeCamera=camera;phase='rescue';
  if(t<10){
   const run=ease(t/2.2),hold=clamp((t-2.2)/.8),throwU=ease((t-4.7)/1.4);
   robot.position.set((-4+4*run)/2.4,t<2.2?Math.abs(Math.sin(t*10))*.045:0,9.55);robot.rotation.set(0,Math.PI,0);robotRoom.fight(t);
   robotRoom.legs.forEach(({leg,knee},i)=>{leg.rotation.x=t<2.2?Math.sin(t*10+i*Math.PI)*.62:0;knee.rotation.x=t<2.2?.3+Math.max(0,-Math.sin(t*10+i*Math.PI))*.65:.12;});
   robotRoom.arms.forEach(a=>a.visible=t<1.7);armRig.visible=t>=1.7;
   spider.g.position.set(-3.2*throwU,Math.sin(throwU*Math.PI)*1.15,6.8-.8*throwU);spider.g.rotation.set(0,Math.PI,.65*Math.sin(throwU*Math.PI));
   spider.animate(t,dt,t<2,'chase',null,null,t>=1.7&&t<5.2?{grab:ease((t-1.7)/.65),lift:.4,open:.5,bite:0}:null);
   scene.updateMatrixWorld(true);
   for(const rig of arms){const leg=spider.legs.find(l=>l.i===0&&l.side===rig.side);const shoulder=V(rig.side*.4,1.65,0);let goal=V(rig.side*.4,1.2,.45);
    if(leg&&t>=2.1&&t<5.1){goal=robot.worldToLocal(spider.body.localToWorld(leg.poseFoot.clone()));}
    else if(t>=5.1){goal=V(rig.side*.4,1.5,.75-.4*ease((t-5.1)/.5));}
    const elbow=shoulder.clone().lerp(goal,.5);elbow.x+=rig.side*.18;elbow.y-=.12;segment(rig.a,shoulder,elbow);segment(rig.b,elbow,goal);rig.palm.position.copy(goal);
   }
   const turn=ease((t-7)/1.2),walk=ease((t-8)/2);
   camera.position.set(0,1.65+Math.sin(t*13)*.015*walk,12+walk*6);camera.rotation.set(0,Math.PI*turn,0);
   film=t>.7&&t<7;phone.visible=film;rec.visible=Math.floor(t*3)%2===0;
   if(film){grip.hold(1);filmCamera.position.copy(camera.position);filmCamera.lookAt(-.4,1.35,8);}
   caption(t<.7?'הרובוט רץ לעזור!':t<1.8?'אני: אני מצלם…':t<4.6?'אני: הוא תפס את הרגליים שלו!':t<7?'רובוט: רוץ למכונית! אני אעצור אותו!':'אני חייב לצאת מכאן!');
  }else if(t<27){
   activeScene=outside;activeCamera=roadCamera;phase=t<16?'car':'drive';
   const approach=ease((t-10)/3),seat=ease((t-13)/2),move=ease((t-17)/9);
   car.g.position.set(8*(1-ease((t-17)/2)),0,7-105*move);car.g.rotation.y=0;car.openDoor(t<14?ease((t-12)/1):1-ease((t-14)/1));
   if(t<15){look(roadCamera,V(2+4.6*approach,1.65-.22*seat,17-9.7*approach),V(8,1,6.4));}
   else{car.g.updateMatrixWorld(true);roadCamera.position.copy(car.g.localToWorld(V(-.42,1.42,.3)));roadCamera.quaternion.copy(car.g.quaternion);}
   const kph=t<17?0:Math.round(15+60*Math.sin(clamp((t-17)/9)*Math.PI));car.indicators.update(t>17&&t<19?'left':null,t,kph);car.wheels.forEach(w=>w.rotation.x=t<17?0:-t*7);car.steering.rotation.z=t>17&&t<19?-.15:0;
   caption(t<13?'אני רץ למכונית…':t<16?'נכנס למכונית וסוגר את הדלת':t<18?'מסובב את המפתח. חייב להגיע הביתה.':t<25?'אני: בבקשה… שהרובוט יהיה בסדר.':'הגעתי הביתה.');
  }else{
   activeScene=home;activeCamera=homeCamera;phase=t<33?'home':t<37?'sleep':'news';
   if(t<32){const u=ease((t-27)/5);look(homeCamera,V(-1-4*u,1.65,6-1.4*u),V(-5,.9,4.5));caption('אני: מה יקרה לרובוט? אני צריך לישון.');}
   else if(t<37){const u=ease((t-32)/2);look(homeCamera,V(-5,1.65-.65*u,4.6),V(-5,2.9,4.5-2*(1-u)));lamp.intensity=45*(1-ease((t-33)/1));caption(t<35?'אני חייב לנוח…':'למחרת בבוקר');}
   else{lamp.intensity=45;home.background.set(0xa2b8c2);look(homeCamera,V(-5,1.18,-3.65),V(-5,1.62,-6.9));homeDecor.update(t,true);if(recorded.length)newsFrame.material.map=recorded[Math.floor((t-37)*2)%recorded.length].texture;news(t);caption(t<41?'חדשות: התקבל תיעוד יוצא דופן מאחוזת המחקר.':t<46?'חדשות: הרובוט עיכב את העכביש ואפשר לחוקר להימלט.':'חדשות: גורלו של הרובוט עדיין לא ידוע…');}
  }
 }
 function render(renderer,w,h){night.resize(w/h);activeCamera.aspect=w/h;activeCamera.updateProjectionMatrix();const narrow=w/h<1;phone.scale.setScalar(narrow?.62:1);phone.position.x=narrow?.055:.24;if(film){const hp=phone.visible,hh=grip.g.visible;phone.visible=false;grip.g.visible=false;let target=screenTarget;if(tNow>=nextCapture){nextCapture=tNow+.5;target=new T.WebGLRenderTarget(256,144);recorded.push(target);}renderer.setRenderTarget(target);renderer.render(scene,filmCamera);renderer.setRenderTarget(null);phoneScreen.material.map=target.texture;phone.visible=hp;grip.g.visible=hh;}renderer.render(activeScene,activeCamera);}
 function stop(){abandoned.visible=false;parkedWrecks.visible=false;night.stop();phone.visible=false;grip.hide();armRig.visible=false;robotRoom.arms.forEach(a=>a.visible=true);recorded.forEach(r=>r.dispose());recorded=[];film=false;}
 return{update,render,stop,night,reset(){night.reset();lastLine='';recorded.forEach(r=>r.dispose());recorded=[];nextCapture=0;robotRoom.arms.forEach(a=>a.visible=true);armRig.visible=false;lamp.intensity=45;home.background.set(0x151a24);update(0,0);},debug(){return{phase,t:tNow,film,phone,grip,phoneScreen,armRig,arms,spider,robot,activeScene,returnCar:car,abandoned,parkedWrecks,night:night.debug(),recorded:recorded.length};}};
}

