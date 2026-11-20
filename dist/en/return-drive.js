const smooth=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u);};
// The car's nose points down local -Z. Align every moving pose with that direction.
export function returnDrivePose(seconds){
 const t=Math.max(0,Math.min(7,seconds));
 if(t<2.4){const angle=Math.PI*smooth(t/2.4);return{x:-2*Math.cos(angle),z:-98-2*Math.sin(angle),yaw:-angle,distance:2*angle,speed:Math.round(12*Math.sin(t/2.4*Math.PI)),turn:'right',steering:-.4};}
 const u=smooth((t-2.4)/4.6);return{x:2,z:-98+95*u,yaw:-Math.PI,distance:2*Math.PI+95*u,speed:Math.round(65*Math.sin((t-2.4)/4.6*Math.PI)),turn:null,steering:0};
}
