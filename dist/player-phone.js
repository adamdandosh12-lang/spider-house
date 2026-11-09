import * as T from './vendor/three.module.js';
import {createPhoneGrip} from './phone-grip.js';
export const PLAYER_PHONE_MODEL='burgundy-pro-max';
export function createPlayerPhone({texture=null,landscape=false}={}){
 const phone=new T.Group();phone.name='iPhone 18 Pro Max — burgundy reference model';phone.userData.model=PLAYER_PHONE_MODEL;
 const material=new T.MeshStandardMaterial({color:0x713e4c,metalness:.4,roughness:.22});
 const outline=new T.Shape(),w=.196,h=.366,r=.024;outline.moveTo(-w/2+r,-h/2);outline.lineTo(w/2-r,-h/2);outline.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);outline.lineTo(w/2,h/2-r);outline.quadraticCurveTo(w/2,h/2,w/2-r,h/2);outline.lineTo(-w/2+r,h/2);outline.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);outline.lineTo(-w/2,-h/2+r);outline.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
 const body=new T.Mesh(new T.ExtrudeGeometry(outline,{depth:.017,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.004,bevelThickness:.003}),material);phone.add(body);
 function detail(w,h,d,x,y,z,color){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,metalness:.65,roughness:.25}));m.position.set(x,y,z);phone.add(m);}
 detail(.055,.014,.004,0,.126,.024,0x060a0d);
 detail(.035,.004,.002,0,.158,.023,0x080d12);detail(.004,.045,.008,-.1,.06,.008,0x72818d);detail(.004,.027,.008,.1,.04,.008,0x72818d);detail(.06,.004,.002,0,-.149,.023,0xd7e3e6);
 detail(.12,.115,.012,-.025,.108,-.014,0x633240);for(const [x,y]of [[-.057,.14],[-.057,.084],[.007,.112]]){const cameraLens=new T.Mesh(new T.CylinderGeometry(.025,.025,.014,24),new T.MeshPhysicalMaterial({color:0x08101a,metalness:.4,roughness:.12,clearcoat:1}));cameraLens.rotation.x=Math.PI/2;cameraLens.position.set(x,y,-.028);phone.add(cameraLens);}
 const lens=new T.Mesh(new T.SphereGeometry(.004,10,8),new T.MeshPhysicalMaterial({color:0x06131d,roughness:.1,metalness:.4}));lens.position.set(.032,.158,.024);phone.add(lens);

 function roundedScreen(){const shape=new T.Shape(),x=.085,y=.155,r=.018;shape.moveTo(-x+r,-y);shape.lineTo(x-r,-y);shape.quadraticCurveTo(x,-y,x,-y+r);shape.lineTo(x,y-r);shape.quadraticCurveTo(x,y,x-r,y);shape.lineTo(-x+r,y);shape.quadraticCurveTo(-x,y,-x,y-r);shape.lineTo(-x,-y+r);shape.quadraticCurveTo(-x,-y,-x+r,-y);const geo=new T.ShapeGeometry(shape,12),uv=geo.attributes.uv,pos=geo.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,(pos.getX(i)+x)/(2*x),(pos.getY(i)+y)/(2*y));return geo;}

 const geometry=roundedScreen();if(landscape){const uv=geometry.attributes.uv;for(let i=0;i<uv.count;i++){const u=uv.getX(i),v=uv.getY(i);uv.setXY(i,v,1-u);}uv.needsUpdate=true;phone.rotation.z=-Math.PI/2;}
 const screen=new T.Mesh(geometry,new T.MeshBasicMaterial({map:texture,color:texture?0xffffff:0x10151a}));screen.name='Player phone display';screen.position.z=.022;phone.add(screen);
 const grip=createPhoneGrip(phone);
 return{phone,screen,grip,setTexture(value){screen.material.map=value;screen.material.color.set(0xffffff);screen.material.needsUpdate=true;}};
}
