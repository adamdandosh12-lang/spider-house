// A supported route along the clear central hall wall. Coordinates are contact points.
export function climbPose(t,wall){const radius=1.2,ceiling=3.575,z=5;let x,y,angle;
 if(t<=3){angle=Math.max(0,t)/3*Math.PI/2;x=wall-radius+radius*Math.sin(angle);y=radius*(1-Math.cos(angle));}
 else if(t<=5){angle=Math.PI/2;x=wall;y=radius+(ceiling-2*radius)*(t-3)/2;}
 else if(t<=8){const a=(t-5)/3*Math.PI/2;angle=Math.PI/2+a;x=wall-radius+radius*Math.cos(a);y=ceiling-radius+radius*Math.sin(a);}
 else{angle=Math.PI;x=(wall-radius)*(1-Math.min(1,(t-8)/4));y=ceiling;}
 return{x,y,z,angle};}
export function createSurfaceClimb(wall){let phase=0,active=false,returning=false,cooldown=0,origin=null;const anchor=climbPose(0,wall);
 return{anchor,get active(){return active;},reset(){phase=0;active=false;returning=false;cooldown=0;},update(dt,{position,allowed,alert}){cooldown=Math.max(0,cooldown-dt);let started=false;
 if(!active&&allowed&&cooldown===0&&Math.hypot(position.x-anchor.x,position.y,position.z-anchor.z)<1.05){active=true;returning=false;phase=-1;origin={...position};started=true;}
 if(!active)return null;if(alert&&phase<0){active=false;cooldown=45;return{...position,angle:0,active:false,started:false};}if(alert)returning=true;phase+=dt*(returning?-1.8:1);if(phase>=12){phase=12;returning=true;}if(phase<0&&!returning){const u=Math.max(0,phase+1);return{x:origin.x+(anchor.x-origin.x)*u,y:0,z:origin.z+(anchor.z-origin.z)*u,angle:0,active:true,started};}if(phase<0){phase=0;active=false;cooldown=45;}
 return{...climbPose(phase,wall),active,started};}};
}
