import * as T from './vendor/three.module.js';
import {createPlayerHand} from './player-hand.js';
const LINES=[
 'אני: הלו? נועה? מה קרה כל כך מוקדם?',
 'נועה: בוקר טוב, אדם. היום אנחנו בודקים את הקורים של העכביש בתא שמונה. אנחנו מנסים לפתח חבלים חזקים שיעזרו לחלץ אנשים. אני צריכה אותך איתנו במעבדה.',
 'נועה: תלבש את בגדי העבודה, קח את התיק ואת תג העובד, וסע אלינו. הצוות כבר מתכונן. ואל תיגש לתא לפני שנבדוק שהזכוכית נעולה. נתראה בקרוב.'
];
export function createBedPhone({camera,group,say,stopSpeech,ring,onStand}){
 let state='ringing',line=-1,time=0,ringAt=0,next=0,riseTime=0;
 const hand=createPlayerHand(T,camera),phone=new T.Group();phone.name='Incoming laboratory phone call';group.add(phone);
 const material=new T.MeshStandardMaterial({color:0x20262b,metalness:.4,roughness:.3});
 const body=new T.Mesh(new T.BoxGeometry(.19,.35,.025),material);phone.add(body);
 const c=document.createElement('canvas');c.width=256;c.height=448;const ctx=c.getContext('2d');ctx.fillStyle='#113d43';ctx.fillRect(0,0,256,448);ctx.textAlign='center';ctx.direction='rtl';ctx.fillStyle='#e5f8ef';ctx.font='bold 30px Arial';ctx.fillText('ד״ר נועה',128,120);ctx.font='22px Arial';ctx.fillText('המעבדה',128,165);ctx.fillStyle='#58d59e';ctx.beginPath();ctx.arc(128,320,32,0,Math.PI*2);ctx.fill();
 const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const screen=new T.Mesh(new T.PlaneGeometry(.17,.31),new T.MeshBasicMaterial({map:texture}));screen.position.z=.014;phone.add(screen);
 function rest(){group.add(phone);phone.position.set(-3.25,.83,3.15);phone.rotation.set(-Math.PI/2,0,.15);}
 rest();camera.position.set(-5,1.18,3.25);camera.lookAt(-4.1,2.2,5.8);camera.rotation.z=-.16;
 function interact(){if(state==='rising'||state==='done'||time<next)return;next=time+.45;stopSpeech();if(state==='ringing'){state='call';camera.add(phone);phone.rotation.set(-.1,-.18,-.12);line=0;say(LINES[line]);}else if(line<LINES.length-1){line++;say(LINES[line]);}else{state='rising';riseTime=0;hand.reset();rest();}}
 function update(dt){time+=dt;if(state==='done')return false;
  const action=matchMedia('(pointer:coarse)').matches?'פעולה':'E';
  const task=document.getElementById('intro-task'),prompt=document.getElementById('intro-prompt');
  if(state==='ringing'){
   if(time>=ringAt){ring();ringAt=time+2.3;}
   phone.position.x=-3.25+Math.sin(time*37)*.006;
   task.textContent='בוקר בבית • שיחה נכנסת מד״ר נועה';prompt.textContent=action+' • לענות לטלפון';
  }else if(state==='call'){
   const lift=Math.min(1,time-next+.45);phone.position.set(.24,-.19-(1-lift)*.2,-.58);hand.pose(.8);hand.g.position.set(.27,-.44,-.63);
   task.textContent='שיחה עם המעבדה • '+(line+1)+' / '+LINES.length;prompt.textContent=action+(line===LINES.length-1?' • לסיים שיחה ולקום מהמיטה':' • להמשיך בשיחה');
  }else{
   riseTime+=dt;const u=Math.min(1,riseTime/2.7),e=u*u*(3-2*u);
   camera.position.set(-5+1.8*e,1.18+.47*e,3.25+2*e);camera.lookAt(-4.1+(4.1)*e,2.2-.55*e,5.8-7*e);camera.rotation.z=-.16*(1-e);
   task.textContent='בוקר בבית • קם מהמיטה';prompt.textContent='';
   if(u===1){state='done';onStand();}
  }
  return true;
 }
 function dispose(){hand.reset();phone.removeFromParent();texture.dispose();phone.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});}
 return{update,interact,dispose,get state(){return state;},get phone(){return phone;}};
}
