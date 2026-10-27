import * as THREE from './vendor/three.module.js';
// Original real-time model inspired by the user's supplied title artwork.
export function createSpider(scene){
 const g=new THREE.Group(),body=new THREE.Group();g.name='Eight Legs — red-eyed hunter';g.add(body);scene.add(g);
 const shell=new THREE.MeshStandardMaterial({color:0x101014,roughness:.48,metalness:.08});
 const joints=new THREE.MeshStandardMaterial({color:0x252125,roughness:.43,metalness:.15});
 const fangMat=new THREE.MeshStandardMaterial({color:0x494039,roughness:.27,metalness:.25});
 const red=new THREE.MeshStandardMaterial({color:0xd91613,emissive:0xff1006,emissiveIntensity:1.65,roughness:.21});
 const hairMat=new THREE.LineBasicMaterial({color:0x4b443f,transparent:true,opacity:.65});
 let seed=9281;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 function orb(radius,material,x,y,z,sx=1,sy=1,sz=1,parent=body){let geometry=new THREE.SphereGeometry(radius,28,20);if(material===shell){let pos=geometry.attributes.position;for(let i=0;i<pos.count;i++){let x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),n=1+Math.sin(x*38+y*27+z*31)*.008;pos.setXYZ(i,x*n,y*n,z*n);}geometry.computeVertexNormals();}let m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m;}
 const abdomen=orb(.93,shell,0,1.35,.7,1.03,1.02,1.24);orb(.61,shell,0,1.12,-.53,1.05,.91,1.05);
 // Scattered bristles form one efficient line mesh over the body shell.
 let bristles=[];for(let i=0;i<1800;i++){let u=rnd()*Math.PI*2,v=Math.acos(rnd()*2-1),n=new THREE.Vector3(Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u));let p=n.clone().multiply(new THREE.Vector3(.96,.95,1.15)).add(new THREE.Vector3(0,1.35,.7));let tip=p.clone().addScaledVector(n,.035+rnd()*.10);bristles.push(p.x,p.y,p.z,tip.x,tip.y,tip.z);}
 let furGeo=new THREE.BufferGeometry();furGeo.setAttribute('position',new THREE.Float32BufferAttribute(bristles,3));body.add(new THREE.LineSegments(furGeo,hairMat));
 // Eight inset red eyes. Dark sockets and tiny highlights prevent a flat glow.
 const eyes=[];for(const [x,y,z,r]of [[-.24,1.35,-1.06,.145],[.24,1.35,-1.06,.145],[-.45,1.23,-.96,.09],[.45,1.23,-.96,.09],[-.12,1.56,-.94,.075],[.12,1.56,-.94,.075],[-.39,1.5,-.9,.06],[.39,1.5,-.9,.06]]){orb(r*1.3,joints,x,y,z+.035,1,1,.7);eyes.push(orb(r,red,x,y,z,1,1,.75));orb(r*.2,new THREE.MeshBasicMaterial({color:0xffd8b6}),x-.025,y+.03,z-r*.7);}
 for(const side of [-1,1]){orb(.2,shell,side*.26,.91,-.98,.95,1.15,1);let points=[new THREE.Vector3(side*.25,.95,-1.08),new THREE.Vector3(side*.34,.71,-1.25),new THREE.Vector3(side*.27,.43,-1.37),new THREE.Vector3(side*.13,.37,-1.36)];let fang=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),14,.065,7,false),fangMat);fang.castShadow=true;body.add(fang);let tip=new THREE.Mesh(new THREE.ConeGeometry(.067,.21,8),fangMat);tip.position.set(side*.16,.4,-1.36);tip.rotation.z=side*1.2;body.add(tip);}
 const legs=[];const up=new THREE.Vector3(0,1,0);
 function link(radius){let mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius*.65,radius,1,8),shell);mesh.castShadow=true;body.add(mesh);let hairs=[];for(let i=0;i<54;i++){let angle=rnd()*Math.PI*2,y=rnd()-.5,x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;hairs.push(x,y,z,x*1.75,y+.03,z*1.75);}let geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(hairs,3));mesh.add(new THREE.LineSegments(geo,hairMat));return mesh;}
 for(const side of [-1,1])for(let i=0;i<4;i++){let hip=new THREE.Group();body.add(hip);let links=[link(.105),link(.095),link(.067)],knee=orb(.13,joints,0,0,0),ankle=orb(.095,joints,0,0,0);legs.push({side,i,hip,links,knee,ankle,footWorld:null,swinging:false,from:null,to:null});}
 const eyeLight=new THREE.PointLight(0xff1608,1.6,4);eyeLight.position.set(0,1.2,-1.1);body.add(eyeLight);
 let phase=0,previous=g.position.clone();
 function between(mesh,a,b){let delta=new THREE.Vector3().subVectors(b,a);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.scale.y=delta.length();mesh.quaternion.setFromUnitVectors(up,delta.normalize());}
 function animate(time,dt,moving=false,mode='patrol',blocked=null,floorHeight=null){
  const traveled=g.position.distanceTo(previous),teleported=traveled>1.5;previous.copy(g.position);
  phase+=moving?Math.min(traveled,.3)*5.6:0;
  body.position.y=Math.sin(time*1.6)*.012+(moving?Math.sin(phase*2)*.022:0);abdomen.rotation.x=Math.sin(time*1.6)*.012;
  const cy=Math.cos(g.rotation.y),sy=Math.sin(g.rotation.y);
  const toWorld=(x,y,z)=>new THREE.Vector3(g.position.x+cy*x+sy*z,g.position.y+y,g.position.z-sy*x+cy*z);
  const toLocal=p=>{let dx=p.x-g.position.x,dz=p.z-g.position.z;return new THREE.Vector3(cy*dx-sy*dz,p.y-g.position.y-body.position.y,sy*dx+cy*dz);};
  for(const l of legs){const {side,i}=l;let reach=1.95,z=(i-1.5)*.84;
   let target=toWorld(side*reach,.055,z-.30);
   if(blocked&&blocked(target.x,target.z,.08)){reach=1.13;target=toWorld(side*reach,.055,z-.20);}
   const floor=floorHeight?floorHeight(target.x,target.z,g.position.y):g.position.y;target.y=(floor??g.position.y)+.055;
   if(!l.footWorld||teleported||l.footWorld.distanceTo(g.position)>3.4){l.footWorld=target.clone();l.swinging=false;}
   const cycle=((phase/(Math.PI*2)+(i%2)*.5+(side>0?.5:0))%1+1)%1;
   const swinging=moving&&cycle>.60;
   if(swinging){
    if(!l.swinging){l.from=l.footWorld.clone();l.to=target.clone();}
    const u=(cycle-.60)/.40,ease=u*u*(3-2*u);l.footWorld.copy(l.from).lerp(l.to,ease);l.footWorld.y+=Math.sin(u*Math.PI)*.25;
   }else if(l.swinging){l.footWorld.copy(l.to);}
   l.swinging=swinging;
   // A planted foot stays fixed in world space while the body advances or breathes.
   const p3=toLocal(l.footWorld),p0=new THREE.Vector3(side*.42,1.12,-.55+i*.38),p1=new THREE.Vector3(side*.78,1.27,(i-1.5)*.54),p2=new THREE.Vector3(side*(reach*.81),1.52+Math.max(0,p3.y)*.25,(i-1.5)*.95);
   between(l.links[0],p0,p1);between(l.links[1],p1,p2);between(l.links[2],p2,p3);l.knee.position.copy(p1);l.ankle.position.copy(p2);
  }
  eyeLight.intensity=mode==='chase'?1.5:.8;
 }
 animate(0,0);return{g,body,legs,eyes,animate};
}
