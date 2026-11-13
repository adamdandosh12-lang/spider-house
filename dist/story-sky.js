import * as T from './vendor/three.module.js';
export function addStorySky(scene,night=false){
 const g=new T.Group();g.name=night?'Moon and night stars':'Daytime sun';scene.add(g);
 const orb=new T.Mesh(new T.SphereGeometry(night?1.35:1.8,24,16),new T.MeshBasicMaterial({color:night?0xdce5ec:0xffe4a2,fog:false}));orb.position.set(-18,24,-34);g.add(orb);
 if(night){const craterMat=new T.MeshBasicMaterial({color:0xa5b2bf,fog:false});for(let i=0;i<7;i++){const dot=new T.Mesh(new T.SphereGeometry(.10+(i%3)*.055,8,6),craterMat);const x=Math.sin(i*2.4)*.65,y=Math.cos(i*1.8)*.65;dot.position.copy(orb.position).add(new T.Vector3(x,y,Math.sqrt(1.35**2-x*x-y*y)));g.add(dot);}const stars=[];for(let i=0;i<150;i++){const a=i*2.39996,r=38;stars.push(Math.cos(a)*r,12+(i%19)*1.3,Math.sin(a)*r);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(stars,3));g.add(new T.Points(geo,new T.PointsMaterial({color:0xc8dbef,size:.055,fog:false})));}
 return g;
}
