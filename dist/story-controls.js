import * as T from './vendor/three.module.js';
// Shared first-person controls: keyboard, joystick and drag look use the same path.
export function createStoryControls(camera){
 let yaw=0,pitch=0,clock=0;
 function face(target){camera.lookAt(target);const e=new T.Euler().setFromQuaternion(camera.quaternion,'YXZ');yaw=e.y;pitch=e.x;}
 return{face,near(x,z,r=1.7){return Math.hypot(camera.position.x-x,camera.position.z-z)<r;},
  place(x,y,z,target){camera.position.set(x,y,z);if(target)face(target);},
  update(dt,input={},canMove=true,blocked=()=>false){clock+=dt;yaw-=input.lookX||0;pitch=T.MathUtils.clamp(pitch-(input.lookY||0),-1.1,1.1);const k=input.keys||{},t=input.touch||{};
   let f=(k.KeyW||k.ArrowUp?1:0)-(k.KeyS||k.ArrowDown?1:0)-(t.y||0),r=(k.KeyD||k.ArrowRight?1:0)-(k.KeyA||k.ArrowLeft?1:0)+(t.x||0);const d=Math.max(1,Math.hypot(f,r)),v=(k.ShiftLeft||k.ShiftRight?4:2.6)*Math.min(dt,.05)/d;
   if(canMove){const dx=(-Math.sin(yaw)*f+Math.cos(yaw)*r)*v,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*r)*v;if(!blocked(camera.position.x+dx,camera.position.z))camera.position.x+=dx;if(!blocked(camera.position.x,camera.position.z+dz))camera.position.z+=dz;camera.position.y=1.65+(Math.hypot(f,r)>.05?Math.sin(clock*9)*.012:0);}
   camera.rotation.set(pitch,yaw,0,'YXZ');
  },get yaw(){return yaw;},reset(){yaw=pitch=clock=0;}
 };
}
export function homeBlocked(x,z){return x< -8.5||x>8.5||z< -7.4||z>7.7|| (x> -6.55&&x< -3.45&&z>2.3&&z<6.65)||(x> -6.85&&x< -3.15&&z> -4.45&&z< -2.65)||(x> -6.8&&x< -3.2&&z< -6.25);}
export function storyDoor(T,parent,x,z){const pivot=new T.Group();pivot.position.set(x-.65,0,z);parent.add(pivot);const mat=new T.MeshStandardMaterial({color:0x53625d,roughness:.65});const panel=new T.Mesh(new T.BoxGeometry(1.3,2.6,.10),mat);panel.position.set(.65,1.3,0);pivot.add(panel);const handle=new T.Mesh(new T.SphereGeometry(.055,12,8),new T.MeshStandardMaterial({color:0xc1b488,metalness:.7,roughness:.25}));handle.position.set(1.12,1.15,.1);pivot.add(handle);pivot.name='Interactive hinged story door';return pivot;}
