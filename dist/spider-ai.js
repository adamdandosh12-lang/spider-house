// The brain only receives sensory observations. It never receives the live player position.
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const copy=p=>p?{x:p.x,z:p.z}:null;
export function inView(observer,yaw,target,range=13,fov=110){
 const dx=target.x-observer.x,dz=target.z-observer.z,d=Math.hypot(dx,dz);
 if(d>range)return false;
 if(d<.85)return true;
 return (-Math.sin(yaw)*dx-Math.cos(yaw)*dz)/d>=Math.cos(fov*Math.PI/360);
}
export function lineClear(a,b,obstacles,eyeHeight=1.3,targetHeight=1.55){
 const d=distance(a,b),steps=Math.ceil(d/.12);
 for(let i=1;i<steps;i++){
  const t=i/steps,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t,y=eyeHeight+(targetHeight-eyeHeight)*t;
  if(obstacles.some(c=>Math.abs(x-c.x)<c.w/2+.015&&Math.abs(z-c.z)<c.d/2+.015&&y>=(c.bottom??0)&&y<=(c.top??3.6)))return false;
 }
 return true;
}
export function createBrain(patrolPoints,rng=Math.random){
 let mode='patrol',target=copy(patrolPoints[0]),lastSeen=null,lostFor=0,searchFor=0,investigateFor=0,notice=0,wait=0,lastNoise=-1,patrolIndex=0;
 const nextPatrol=()=>{patrolIndex=(patrolIndex+1+Math.floor(rng()*Math.max(1,patrolPoints.length-1)))%patrolPoints.length;target=copy(patrolPoints[patrolIndex]);mode='patrol';wait=.6;};
 return{
  update(dt,{position,visiblePosition=null,heardNoise=null,awake=true}){
   if(!awake)return{mode:'sleep',target:null,speedFactor:0,notice:0};
   wait=Math.max(0,wait-dt);
   if(visiblePosition){
    notice=Math.min(1,notice+dt/((mode==='chase'||mode==='search')?.12:.3));
    if(notice>=1){mode='chase';target=copy(visiblePosition);lastSeen=copy(visiblePosition);lostFor=0;searchFor=0;wait=0;}
   }else{notice=Math.max(0,notice-dt*1.5);if(mode==='chase')lostFor+=dt;}
   if(mode==='chase'&&!visiblePosition&&(distance(position,target)<.85||lostFor>6)){
    mode='search';target=copy(lastSeen);searchFor=0;wait=1.1;
   }
   // Hear a discrete sound once, and only if supplied by the hearing sensor.
   if(heardNoise&&heardNoise.id>lastNoise){
    lastNoise=heardNoise.id;
    if(mode!=='chase'&&mode!=='search'){mode='investigate';target=copy(heardNoise);searchFor=0;investigateFor=0;wait=.3;}
   }
   if(mode==='investigate')investigateFor+=dt;
   if(mode==='investigate'&&(distance(position,target)<.9||investigateFor>8)){mode='search';lastSeen=copy(target);searchFor=0;wait=1.1;}
   if(mode==='search'){
    searchFor+=dt;
    if(searchFor>6){lastSeen=null;notice=0;nextPatrol();}
    else if(wait<=0&&distance(position,target)<1){
     const angle=rng()*Math.PI*2,r=1.2+rng()*1.5;
     target={x:lastSeen.x+Math.cos(angle)*r,z:lastSeen.z+Math.sin(angle)*r};wait=.8;
    }
   }
   if(mode==='patrol'&&distance(position,target)<1)nextPatrol();
   return{mode,target:copy(target),speedFactor:(wait>0||(notice>0&&mode!=='chase'))?0:mode==='chase'?1.5:mode==='investigate'?.9:mode==='search'?.65:.58,notice};
  },
  snapshot(){return{mode,target:copy(target),lastSeen:copy(lastSeen),lostFor,searchFor,notice};}
 };
}
