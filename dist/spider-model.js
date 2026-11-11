import * as THREE from './vendor/three.module.js';
// Original anatomy-led model. References and attribution notes are in ART_REFERENCES.md.
export function createSpider(scene){
 const g=new THREE.Group(),body=new THREE.Group();g.name='Eight Legs — naturalistic hunter';const surfaceFrame=new THREE.Group();g.add(surfaceFrame);surfaceFrame.add(body);scene.add(g);
 let seed=9281;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 function skinTextures(){const size=128,color=new Uint8Array(size*size*4),bump=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4,fleck=rnd(),wave=Math.sin(x*.21+Math.sin(y*.13)*2)*Math.sin(y*.17),v=26+wave*6+fleck*12;color.set([v*1.15,v,v*.85,255],i);let grain=100+fleck*65;bump.set([grain,grain,grain,255],i);}
  const map=new THREE.DataTexture(color,size,size);map.colorSpace=THREE.SRGBColorSpace;map.magFilter=map.minFilter=THREE.LinearFilter;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.needsUpdate=true;
  const relief=new THREE.DataTexture(bump,size,size);relief.magFilter=relief.minFilter=THREE.LinearFilter;relief.wrapS=relief.wrapT=THREE.RepeatWrapping;relief.needsUpdate=true;return{map,relief};
 }
 const {map,relief}=skinTextures();
 const shell=new THREE.MeshStandardMaterial({color:0xffffff,map,bumpMap:relief,bumpScale:.016,roughness:.57,metalness:0});
 const carapaceMat=new THREE.MeshPhysicalMaterial({color:0xb9b5ac,map,bumpMap:relief,bumpScale:.007,roughness:.32,clearcoat:.34,clearcoatRoughness:.3});
 const joints=new THREE.MeshStandardMaterial({color:0x24201b,roughness:.61});
 const fangMat=new THREE.MeshPhysicalMaterial({color:0x191711,roughness:.23,clearcoat:.65});
 const eyeMat=new THREE.MeshPhysicalMaterial({color:0x180d09,emissive:0x550c04,emissiveIntensity:.035,roughness:.07,clearcoat:1,clearcoatRoughness:.03});
 const glintMat=new THREE.MeshBasicMaterial({color:0xafb9b5});
 const hairMat=new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.72});
 function orb(radius,material,x,y,z,sx=1,sy=1,sz=1,parent=body){const geometry=new THREE.SphereGeometry(radius,28,20),mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 const abdomen=orb(1,shell,0,1.08,.88,.83,.73,1.08);abdomen.name='Soft oval abdomen';
 const prosoma=orb(1,carapaceMat,0,.92,-.64,.74,.43,.72);prosoma.name='Cephalothorax';
 orb(.20,joints,0,.88,.08,.75,.70,1.5);
 // Subtle radial ridges on the hard carapace and paired mouth plates.
 const ridgeMat=new THREE.LineBasicMaterial({color:0x4c4436,transparent:true,opacity:.42});const ridges=[];for(const side of [-1,1])for(let i=0;i<4;i++){ridges.push(side*.08,1.33,-.48,side*(.38+i*.07),1.25,-.95+i*.20);if(i===0)orb(.11,joints,side*.14,.67,-1.12,.75,.7,1.5);}const ridgeGeo=new THREE.BufferGeometry();ridgeGeo.setAttribute('position',new THREE.Float32BufferAttribute(ridges,3));body.add(new THREE.LineSegments(ridgeGeo,ridgeMat));
 // Two curved segments per bristle, with varied color and length, give a soft silhouette.
 function furOnEllipsoid(center,radii,count,minLength,maxLength){const positions=[],colors=[];
  for(let i=0;i<count;i++){const u=rnd()*Math.PI*2,v=Math.acos(2*rnd()-1),n=new THREE.Vector3(Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u)),p=n.clone().multiply(radii).add(center),length=minLength+rnd()*(maxLength-minLength),tip=p.clone().addScaledVector(n,length);tip.z+=length*.28;const mid=p.clone().lerp(tip,.55).add(new THREE.Vector3(0,length*.15,0));positions.push(...p.toArray(),...mid.toArray(),...mid.toArray(),...tip.toArray());const tone=.10+rnd()*.13;for(let j=0;j<4;j++)colors.push(tone*1.20,tone,tone*.73);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));const fur=new THREE.LineSegments(geo,hairMat);body.add(fur);return fur;
 }
 const abdomenFur=furOnEllipsoid(new THREE.Vector3(0,1.08,.88),new THREE.Vector3(.835,.735,1.085),3600,.035,.14);
 furOnEllipsoid(new THREE.Vector3(0,.92,-.64),new THREE.Vector3(.745,.435,.725),950,.015,.05);
 // A small eye cluster on top of the front body, rather than a separate face.
 const eyes=[];
 for(const [x,y,z,r]of [[-.085,1.23,-1.13,.067],[.085,1.23,-1.13,.067],[-.21,1.20,-1.12,.046],[.21,1.20,-1.12,.046],[-.07,1.29,-1.035,.044],[.07,1.29,-1.035,.044],[-.18,1.27,-1.04,.039],[.18,1.27,-1.04,.039]]){
  orb(r*1.18,joints,x,y,z+.01,1,1,.8);eyes.push(orb(r,eyeMat,x,y,z,1,1,.85));orb(r*.12,glintMat,x-.012,y+.014,z-r*.78);
 }
 // Chelicerae and inward-curved fangs sit under the eye cluster.
 const fangs=[];for(const side of [-1,1]){orb(.19,carapaceMat,side*.23,.73,-1.25,1,1.35,.9);const points=[new THREE.Vector3(side*.23,.65,-1.34),new THREE.Vector3(side*.29,.47,-1.48),new THREE.Vector3(side*.19,.30,-1.53),new THREE.Vector3(side*.10,.29,-1.48)];let curve=new THREE.CatmullRomCurve3(points),geometry=new THREE.TubeGeometry(curve,16,.048,8,false);const pos=geometry.attributes.position;for(let i=0;i<pos.count;i++){let ring=Math.floor(i/9),t=ring/16,center=curve.getPointAt(t),k=1-t*.92;pos.setXYZ(i,center.x+(pos.getX(i)-center.x)*k,center.y+(pos.getY(i)-center.y)*k,center.z+(pos.getZ(i)-center.z)*k);}geometry.computeVertexNormals();const fang=new THREE.Mesh(geometry,fangMat);fang.castShadow=true;const pivot=new THREE.Group();pivot.position.set(side*.23,.65,-1.34);fang.position.copy(pivot.position).multiplyScalar(-1);pivot.add(fang);body.add(pivot);fangs.push({side,pivot});}
 const up=new THREE.Vector3(0,1,0);
 function link(radius,hairCount=36,material=shell){const geo=new THREE.CylinderGeometry(radius*.70,radius,1,12,3);const mesh=new THREE.Mesh(geo,material);mesh.castShadow=mesh.receiveShadow=true;body.add(mesh);
  const positions=[],colors=[];for(let i=0;i<hairCount;i++){const angle=rnd()*Math.PI*2,y=rnd()-.5,r=radius*(.85-.3*y),x=Math.cos(angle)*r,z=Math.sin(angle)*r,length=.025+rnd()*.06;positions.push(x,y,z,x+Math.cos(angle)*length,y+.035,z+Math.sin(angle)*length);let c=.12+rnd()*.14;for(let j=0;j<2;j++)colors.push(c*1.15,c,c*.75);}
  const hairs=new THREE.BufferGeometry();hairs.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));hairs.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));mesh.add(new THREE.LineSegments(hairs,hairMat));return mesh;
 }
 function between(mesh,a,b){const d=new THREE.Vector3().subVectors(b,a),length=d.length();mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.scale.y=Math.max(.001,length);mesh.quaternion.setFromUnitVectors(up,d.normalize());}
 const legs=[];
 for(const side of [-1,1])for(let i=0;i<4;i++){
  const links=[link(.11,18),link(.12,22),link(.155,80),link(.14,26),link(.095,65),link(.061,45),link(.037,24)];
  const knee=orb(.12,joints,0,0,0),ankle=orb(.085,joints,0,0,0);
  legs.push({side,i,links,knee,ankle,footWorld:null,swinging:false,from:null,to:null});
 }
 // Pedipalps are a separate, shorter pair of mouth appendages, not walking legs.
 const palps=[];for(const side of [-1,1]){const links=[link(.083,25),link(.064,24),link(.047,16)];palps.push({side,links});}
 const spinnerets=[];for(const side of [-1,1])for(let i=0;i<2;i++){const part=orb(.065,joints,side*(i?.15:.28),.77,.88+1.04+i*.05,.8,.8,i?2.3:3.4);part.rotation.x=.2;spinnerets.push(part);}
 const eyeLight=new THREE.PointLight(0x9d2512,.08,2.8);eyeLight.position.set(0,1.1,-1.2);body.add(eyeLight);
 let phase=0,previous=g.position.clone(),previousYaw=0;
 function animate(time,dt,moving=false,mode='patrol',blocked=null,floorHeight=null,capture=null,surfaceAngle=0,footAnchor=null){
  surfaceFrame.rotation.z=surfaceAngle;
  const traveled=g.position.distanceTo(previous),turn=Math.atan2(Math.sin(g.rotation.y-previousYaw),Math.cos(g.rotation.y-previousYaw)),teleported=traveled>1.5;previous.copy(g.position);previousYaw=g.rotation.y;
  const stepping=moving||Math.abs(turn)>.004;phase+=stepping?Math.min(traveled,.3)*5.0+Math.min(Math.abs(turn),.2)*.75:0;
  body.position.z=capture?-capture.bite*.34:0;for(const f of fangs){f.pivot.rotation.x=capture?-capture.open*.8+capture.bite*.35:0;f.pivot.rotation.z=capture?f.side*(capture.open*.65-capture.bite*.22):0;}
  const breath=Math.sin(time*1.4)*.006;body.position.y=breath+(stepping?Math.sin(phase*2)*.013:0);abdomen.scale.y=.73+breath;abdomenFur.scale.y=1+breath*.25;
  const cy=Math.cos(g.rotation.y),sy=Math.sin(g.rotation.y),toWorld=(x,y,z)=>new THREE.Vector3(g.position.x+cy*x+sy*z,g.position.y+y,g.position.z-sy*x+cy*z),toLocal=p=>{const dx=p.x-g.position.x,dz=p.z-g.position.z;return new THREE.Vector3(cy*dx-sy*dz,p.y-g.position.y-body.position.y,sy*dx+cy*dz);};
  for(const l of legs){const {side,i}=l;let reach=[1.68,2.08,2.13,1.88][i],z=[-1.87,-.73,.66,1.71][i],target=toWorld(side*reach,.045,z-.28);
   if(blocked&&blocked(target.x,target.z,.07)){reach=1.05;target=toWorld(side*reach,.045,z-.15);}
   const floor=floorHeight?floorHeight(target.x,target.z,g.position.y):g.position.y;target.y=(floor??g.position.y)+.045;
   if(!l.footWorld||teleported||l.footWorld.distanceTo(g.position)>3.35){l.footWorld=target.clone();l.swinging=false;}
   const cycle=((phase/(Math.PI*2)+(i%2)*.5+(side>0?.5:0))%1+1)%1,swinging=stepping&&cycle>.62;
   if(swinging){if(!l.swinging){l.from=l.footWorld.clone();l.to=target.clone();}const u=(cycle-.62)/.38,ease=u*u*(3-2*u);l.footWorld.copy(l.from).lerp(l.to,ease);l.footWorld.y+=Math.sin(u*Math.PI)*.20;}else if(l.swinging)l.footWorld.copy(l.to);l.swinging=swinging;
   const foot=surfaceAngle?new THREE.Vector3(side*reach,.045+Math.max(0,Math.sin(time*5+i*Math.PI+side))* .14,z-.28):toLocal(l.footWorld);if(capture&&i===0)foot.lerp(new THREE.Vector3(side*.38,1.35+capture.lift*1.05,-1.9),capture.grab);const hipZ=-.96+i*.27,p0=new THREE.Vector3(side*.45,.88,hipZ),p1=new THREE.Vector3(side*.62,.88,hipZ),p2=new THREE.Vector3(side*.76,1.03,hipZ+(z-hipZ)*.18),p3=new THREE.Vector3(side*reach*.73,1.40+Math.max(0,foot.y)*.2,z*.83),p4=p3.clone().add(new THREE.Vector3(side*.06,-.14,.015)),p5=p4.clone().lerp(foot,.61).add(new THREE.Vector3(0,.12,0)),p6=p4.clone().lerp(foot,.91).add(new THREE.Vector3(0,.035,0)),points=[p0,p1,p2,p3,p4,p5,p6,foot];
   if(footAnchor){footAnchor(foot,l,body.position.y);p5.copy(p4).lerp(foot,.61).add(new THREE.Vector3(0,.12,0));p6.copy(p4).lerp(foot,.91).add(new THREE.Vector3(0,.035,0));}
   l.poseFoot=foot.clone();for(let j=0;j<7;j++)between(l.links[j],points[j],points[j+1]);l.knee.position.copy(p3);l.ankle.position.copy(p5);
  }
  for(const p of palps){const spread=Math.sin(time*2.2+p.side)*.025,a=new THREE.Vector3(p.side*.43,.78,-1.05),b=new THREE.Vector3(p.side*(.65+spread),.70,-1.35),c=new THREE.Vector3(p.side*.55,.37,-1.65),d=new THREE.Vector3(p.side*.40,.25,-1.80);between(p.links[0],a,b);between(p.links[1],b,c);between(p.links[2],c,d);}
  eyeLight.intensity=mode==='chase'?.055:.012;
 }
 animate(0,0);return{g,body,surfaceFrame,legs,eyes,palps,spinnerets,fangs,animate};
}
