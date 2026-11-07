export function createLabSpiderMotion(spider){
 let time=0,releaseOrigin=null,releaseAngle=0;
 function update(dt,disaster,camera){
  time+=dt;let angle=0;
  if(disaster<2){
   const cycle=time%12;let x=0,y=.45,z=-4;
   if(cycle<3){const u=cycle/3;x=-.4*(1-u);z=-3.9-1.1*u;}
   else if(cycle<4){angle=(cycle-3)*Math.PI/2;z=-5;}
   else if(cycle<7){angle=Math.PI/2;z=-5;y=.45+(cycle-4)/3*1.05;}
   else if(cycle<10){angle=Math.PI/2;z=-5;y=1.5-(cycle-7)/3*1.05;}
   else if(cycle<11){angle=(11-cycle)*Math.PI/2;z=-5;}
   else{x=-.4*(cycle-11);z=-5+1.1*(cycle-11);}
   spider.g.position.set(x,y,z);spider.g.rotation.y=0;spider.g.scale.setScalar(.23+Math.max(0,disaster)*.065);spider.g.userData.surface=angle>.01?'wall':'platform';
  }else{
   if(!releaseOrigin){releaseOrigin=spider.g.position.clone();releaseAngle=spider.surfaceFrame.rotation.x;}const released=disaster-2,drop=Math.min(1,released/.9),walk=Math.min(1,released/3),approach=Math.max(0,Math.min(1,(disaster-8)/4));
   spider.g.scale.setScalar(.36+Math.min(released/3,1)*.74);spider.g.position.set(releaseOrigin.x+(1.8-releaseOrigin.x)*walk,releaseOrigin.y*(1-drop*drop),releaseOrigin.z+(-.8-releaseOrigin.z)*walk+approach*2.2);angle=releaseAngle*(1-drop);spider.g.rotation.y=Math.atan2(spider.g.position.x-camera.position.x,spider.g.position.z-camera.position.z);spider.g.userData.surface=drop===1?'floor':'landing';if(disaster>=9.8){const rush=Math.min(1,(disaster-9.8)/1.8),dx=camera.position.x-1.8,dz=camera.position.z-1.4,length=Math.max(.01,Math.hypot(dx,dz));spider.g.position.x=1.8+(dx-dx/length*.9)*rush;spider.g.position.z=1.4+(dz-dz/length*.9)*rush;spider.g.userData.surface='charging';}
  }
  spider.animate(time,dt,true,'patrol');spider.surfaceFrame.rotation.x=angle;
 }
 return{update};
}
