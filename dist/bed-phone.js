import {createPhoneThumb} from './phone-thumb.js';
import {createPhoneMessages} from './phone-messages.js';
import * as T from './vendor/three.module.js';
import {createPlayerHand} from './player-hand.js';
const LINES=[
 'אני: הלו? נועה? מה קרה כל כך מוקדם?',
 'נועה: בוקר טוב, אדם. היום אנחנו בודקים את הקורים של העכביש בתא שמונה. אנחנו מנסים לפתח חבלים חזקים שיעזרו לחלץ אנשים. אני צריכה אותך איתנו במעבדה.',
 'נועה: תלבש את בגדי העבודה, קח את התיק ואת תג העובד, וסע אלינו. הצוות כבר מתכונן. ואל תיגש לתא לפני שנבדוק שהזכוכית נעולה. נתראה בקרוב.'
];
export function createBedPhone({camera,group,say,stopSpeech,ring,onStand}){
 let state='ringing',line=-1,time=0,ringAt=0,next=0,riseTime=0,pickTime=0,pickFrom=new T.Vector3(),pickRotation=new T.Quaternion(),riseRotation=new T.Quaternion(),stowTime=0,tapTime=0,tapOpened=false;
 const hand=createPlayerHand(T,camera),phone=new T.Group();phone.name='iPhone 18 Pro Max — burgundy reference model';group.add(phone);const thumb=createPhoneThumb(phone);
 const material=new T.MeshStandardMaterial({color:0x713e4c,metalness:.4,roughness:.22});
 const outline=new T.Shape(),w=.196,h=.366,r=.024;outline.moveTo(-w/2+r,-h/2);outline.lineTo(w/2-r,-h/2);outline.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);outline.lineTo(w/2,h/2-r);outline.quadraticCurveTo(w/2,h/2,w/2-r,h/2);outline.lineTo(-w/2+r,h/2);outline.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);outline.lineTo(-w/2,-h/2+r);outline.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
 const body=new T.Mesh(new T.ExtrudeGeometry(outline,{depth:.017,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.004,bevelThickness:.003}),material);phone.add(body);
 function detail(w,h,d,x,y,z,color){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,metalness:.65,roughness:.25}));m.position.set(x,y,z);phone.add(m);}
 const dock=new T.Group();dock.name='Phone charging stand on shelf';group.add(dock);dock.position.set(-3.25,.825,3.15);const base=new T.Mesh(new T.BoxGeometry(.26,.025,.2),new T.MeshStandardMaterial({color:0x59616a,roughness:.4,metalness:.5}));dock.add(base);const support=new T.Mesh(new T.BoxGeometry(.035,.17,.045),base.material);support.position.set(0,.085,-.05);dock.add(support);
 detail(.055,.014,.004,0,.126,.024,0x060a0d);
 detail(.035,.004,.002,0,.158,.023,0x080d12);detail(.004,.045,.008,-.1,.06,.008,0x72818d);detail(.004,.027,.008,.1,.04,.008,0x72818d);detail(.06,.004,.002,0,-.149,.023,0xd7e3e6);
 detail(.12,.115,.012,-.025,.108,-.014,0x633240);for(const [x,y]of [[-.057,.14],[-.057,.084],[.007,.112]]){const cameraLens=new T.Mesh(new T.CylinderGeometry(.025,.025,.014,24),new T.MeshPhysicalMaterial({color:0x08101a,metalness:.4,roughness:.12,clearcoat:1}));cameraLens.rotation.x=Math.PI/2;cameraLens.position.set(x,y,-.028);phone.add(cameraLens);}
 const lens=new T.Mesh(new T.SphereGeometry(.004,10,8),new T.MeshPhysicalMaterial({color:0x06131d,roughness:.1,metalness:.4}));lens.position.set(.032,.158,.024);phone.add(lens);
 const c=document.createElement('canvas');c.width=256;c.height=448;const ctx=c.getContext('2d');const background=ctx.createLinearGradient(0,0,256,448);background.addColorStop(0,'#633b51');background.addColorStop(1,'#17131f');ctx.fillStyle=background;ctx.fillRect(0,0,256,448);ctx.textAlign='center';ctx.direction='rtl';ctx.fillStyle='#e5f8ef';ctx.font='bold 30px Arial';ctx.fillText('ד״ר נועה',128,120);ctx.font='22px Arial';ctx.fillText('המעבדה',128,165);ctx.font='18px Arial';ctx.fillText('שיחה נכנסת',128,65);ctx.fillStyle='#e8dfdf';ctx.font='16px Arial';ctx.textAlign='left';ctx.fillText('07:10',17,29);ctx.fillRect(208,18,24,10);ctx.fillStyle='#17131f';ctx.fillRect(210,20,17,6);ctx.textAlign='center';ctx.fillStyle='#58d59e';ctx.beginPath();ctx.arc(128,320,32,0,Math.PI*2);ctx.fill();
 function roundedScreen(){const shape=new T.Shape(),x=.085,y=.155,r=.018;shape.moveTo(-x+r,-y);shape.lineTo(x-r,-y);shape.quadraticCurveTo(x,-y,x,-y+r);shape.lineTo(x,y-r);shape.quadraticCurveTo(x,y,x-r,y);shape.lineTo(-x+r,y);shape.quadraticCurveTo(-x,y,-x,y-r);shape.lineTo(-x,-y+r);shape.quadraticCurveTo(-x,-y,-x+r,-y);const geo=new T.ShapeGeometry(shape,12),uv=geo.attributes.uv,pos=geo.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,(pos.getX(i)+x)/(2*x),(pos.getY(i)+y)/(2*y));return geo;}
 const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const screen=new T.Mesh(roundedScreen(),new T.MeshBasicMaterial({map:texture}));screen.position.z=.022;phone.add(screen);const messages=createPhoneMessages(ctx,texture);
 function rest(){group.add(phone);phone.position.set(-3.25,1.03,3.15);phone.lookAt(-4.4,1.18,3.25);}
 rest();camera.position.set(-4.4,1.18,3.25);camera.lookAt(-3.25,1.03,3.15);camera.rotation.z=-.16;
 function interact(){if(['pickup','message-pickup','rising','stowing','tapping','done'].includes(state)||time<next)return;next=time+.45;stopSpeech();if(state==='home-screen'){state='tapping';tapTime=0;tapOpened=false;return;}if(state==='messages'){state='stowing';stowTime=0;return;}if(state==='ringing'){state='pickup';pickTime=0;camera.updateMatrixWorld(true);camera.attach(phone);pickFrom.copy(phone.position);pickRotation.copy(phone.quaternion);}else if(line<LINES.length-1){line++;say(LINES[line]);}else{state='rising';riseTime=0;riseRotation.copy(camera.quaternion);}}
 function update(dt){time+=dt;if(state==='done')return false;
  const heldX=Math.min(.12,Math.max(.015,camera.aspect*.075));const held=new T.Vector3(heldX,-.06,-.54);
  const action=matchMedia('(pointer:coarse)').matches?'פעולה':'E';
  const task=document.getElementById('intro-task'),prompt=document.getElementById('intro-prompt');
  if(state==='ringing'){
   if(time>=ringAt){ring();ringAt=time+2.3;}
   phone.position.x=-3.25+Math.sin(time*37)*.006;
   task.textContent='בוקר בבית • שיחה נכנסת מד״ר נועה';prompt.textContent=action+' • לענות לטלפון';
  }else if(state==='pickup'||state==='message-pickup'){
   pickTime+=dt;const u=Math.max(0,Math.min(1,(pickTime-.55)/1.05)),e=u*u*(3-2*u);phone.position.copy(pickFrom).lerp(held,e);phone.quaternion.copy(pickRotation).slerp(new T.Quaternion().setFromEuler(new T.Euler(-.1,-.18,-.12)),e);hand.grip(Math.min(1,pickTime/.55));const reach=Math.min(1,pickTime/.55);hand.g.position.copy(new T.Vector3(.12,-.48,-.45)).lerp(phone.position.clone().add(new T.Vector3(.04,-.18,-.1)),reach);
   task.textContent='מרים את הטלפון מהמדף…';prompt.textContent='';
   if(u===1){if(state==='message-pickup'){state='home-screen';messages.home();document.getElementById('intro-line').hidden=false;document.getElementById('intro-line').textContent='יש לך הודעה חדשה מאמא ב־WhatsApp.';}else{state='call';line=0;say(LINES[line]);}next=time+(state==='home-screen'?0:.45);}
  }else if(state==='call'||state==='home-screen'||state==='messages'||state==='tapping'){
   phone.position.copy(held);hand.grip(1);hand.g.position.copy(held).add(new T.Vector3(.04,-.18,-.1));
   if(state==='tapping'){tapTime+=dt;const press=tapTime<.35?tapTime/.35:1-(tapTime-.35)/.35;thumb.pose(press*press*(3-2*press));if(tapTime>=.35&&!tapOpened){tapOpened=true;messages.chat();document.getElementById('intro-line').hidden=false;document.getElementById('intro-line').textContent='אמא: בהצלחה בניסוי 8! אני בדיוק רואה את החדשות.';}if(tapTime>=.7){thumb.pose(0);state='messages';next=time+.15;}}
   if(state==='call'){task.textContent='שיחה עם המעבדה • '+(line+1)+' / '+LINES.length;prompt.textContent=action+(line===LINES.length-1?' • לסיים שיחה ולקום מהמיטה':' • להמשיך בשיחה');}else{task.textContent=state==='tapping'?'פותח WhatsApp…':state==='home-screen'?'הטלפון שלך • הודעה חדשה מאמא':'WhatsApp • אמא';prompt.textContent=state==='tapping'?'':action+(state==='home-screen'?' • לפתוח WhatsApp':' • לסגור את הטלפון ולהתארגן');}
  }else if(state==='stowing'){stowTime+=dt;phone.position.copy(held).add(new T.Vector3(.2*stowTime,-stowTime,0));hand.g.position.copy(phone.position).add(new T.Vector3(.04,-.18,-.1));task.textContent='שם את הטלפון בכיס…';prompt.textContent='';if(stowTime>.7){phone.visible=false;hand.reset();state='done';onStand();}
  }else{
   riseTime+=dt;const put=Math.min(1,riseTime/.7);if(put<1){camera.updateMatrixWorld(true);const dest=camera.worldToLocal(new T.Vector3(-3.25,1.03,3.15));phone.position.copy(held).lerp(dest,put);hand.g.position.copy(phone.position).add(new T.Vector3(.04,-.18,-.1));}else{hand.reset();rest();}
   const u=Math.max(0,Math.min(1,(riseTime-.7)/2.7)),e=u*u*(3-2*u);
   camera.position.set(-4.4+2.6*e,1.18+.47*e,3.25+2*e);camera.quaternion.copy(riseRotation).slerp(new T.Quaternion(),e);
   task.textContent='בוקר בבית • קם מהמיטה';prompt.textContent='';
   if(u===1){state='message-pickup';camera.updateMatrixWorld(true);camera.attach(phone);pickFrom.copy(phone.position);pickRotation.copy(phone.quaternion);pickTime=0;}
  }
  return true;
 }
 function releaseForMovement(){if(!['message-pickup','home-screen','tapping','messages','stowing'].includes(state))return false;stopSpeech();state='done';phone.visible=false;hand.reset();thumb.pose(0);document.getElementById('intro-line').hidden=true;onStand();return true;}
 function dispose(){hand.reset();phone.removeFromParent();texture.dispose();dock.removeFromParent();dock.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});phone.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});}
 return{update,interact,dispose,releaseForMovement,get holdingHand(){return hand.g;},get tappingHand(){return thumb.g;},get thumbTip(){return thumb.tip;},get state(){return state;},get phone(){return phone;}};
}
