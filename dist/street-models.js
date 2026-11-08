import {addTurnDisplay} from './turn-display.js';
import * as T from './vendor/three.module.js';
function mesh(parent,geo,mat,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;}
export function addCarSeats(parent){
 const upholstery=new T.MeshStandardMaterial({color:0x293a40,roughness:.85}),edge=new T.MeshStandardMaterial({color:0x17272d,roughness:.7}),stitch=new T.MeshStandardMaterial({color:0x7e9296,roughness:1});
 for(const x of [-.43,.43]){const seat=new T.Group();seat.name='Upholstered front car seat';seat.position.set(x,0,.3);parent.add(seat);mesh(seat,new T.BoxGeometry(.64,.18,.7),upholstery,0,.66,0);mesh(seat,new T.BoxGeometry(.62,.68,.16),upholstery,0,1.03,.33);mesh(seat,new T.BoxGeometry(.36,.22,.13),upholstery,0,1.52,.34);for(const side of [-1,1]){mesh(seat,new T.BoxGeometry(.08,.23,.66),edge,side*.29,.72,0);mesh(seat,new T.BoxGeometry(.07,.55,.17),edge,side*.28,1.05,.29);mesh(seat,new T.BoxGeometry(.008,.54,.014),stitch,side*.19,1.02,.239);}for(let i=0;i<4;i++)mesh(seat,new T.BoxGeometry(.45,.008,.015),stitch,0,.76,-.2+i*.12);}
 const rear=mesh(parent,new T.BoxGeometry(1.4,.22,.5),upholstery,0,.65,1.35);rear.name='Rear car bench';mesh(parent,new T.BoxGeometry(1.4,.58,.15),upholstery,0,1.03,1.6);
}
export function createSteeringWheel(parent,x=-.43,y=1.25,z=-.35){
 const wheel=new T.Group();wheel.name='Leather three spoke steering wheel';wheel.position.set(x,y,z);wheel.rotation.x=-.3;wheel.scale.setScalar(.5);parent.add(wheel);const leather=new T.MeshStandardMaterial({color:0x1c282e,roughness:.75}),metal=new T.MeshStandardMaterial({color:0x9bafb5,metalness:.7,roughness:.3});mesh(wheel,new T.TorusGeometry(.205,.026,12,40),leather);
 for(const angle of [0,Math.PI*2/3,Math.PI*4/3]){const spoke=mesh(wheel,new T.BoxGeometry(.065,.19,.024),metal,Math.sin(angle)*.09,Math.cos(angle)*.09,.01);spoke.rotation.z=-angle;}const hub=mesh(wheel,new T.CylinderGeometry(.075,.075,.045,24),leather,0,0,.025);hub.rotation.x=Math.PI/2;mesh(wheel,new T.CircleGeometry(.024,18),metal,0,0,.05);return wheel;
}
export function createStreetCar(parent,color=0x2e626a,variant='sedan'){
 const g=new T.Group();g.name='Detailed street sedan';parent.add(g);
 const paint=new T.MeshPhysicalMaterial({color,roughness:.28,metalness:.5,clearcoat:.8,clearcoatRoughness:.22}),rubber=new T.MeshStandardMaterial({color:0x171c20,roughness:.9}),chrome=new T.MeshStandardMaterial({color:0xaeb8bf,roughness:.22,metalness:.8}),glass=new T.MeshPhysicalMaterial({color:0x83aebb,transparent:true,opacity:.38,roughness:.1,depthWrite:false,side:T.DoubleSide}),trim=new T.MeshStandardMaterial({color:0x253139,roughness:.6});
 const box=(p,w,h,d,mat,x,y,z)=>mesh(p,new T.BoxGeometry(w,h,d),mat,x,y,z);
 // Sculpted body cross sections soften the hood, boot and bumpers.
 const rings=variant==='supercar'?[[-2.22,.86,.45,.67],[-1.78,1.02,.45,.82],[-.95,1.04,.48,.93],[.95,1.04,.48,.95],[1.8,1,.5,.9],[2.05,.94,.53,.85]]:[[-2.16,.76,.56,.88],[-1.78,.96,.56,1.04],[-.95,1,.57,1.09],[.95,1,.57,1.1],[1.8,.94,.58,1.02],[2.05,.78,.61,.91]],positions=[],indices=[];
 for(const [z,w,b,t]of rings)for(const [x,y]of [[-w*.84,b],[-w,b+.1],[-w,t-.07],[-w*.86,t],[w*.86,t],[w,t-.07],[w,b+.1],[w*.84,b]])positions.push(x,y,z);
 for(let r=0;r<rings.length-1;r++)for(let i=0;i<8;i++){if(r===2&&i===3)continue;const a=r*8+i,b=r*8+(i+1)%8,c=b+8,d=a+8;indices.push(a,b,c,a,c,d);}for(let i=1;i<7;i++)indices.push(0,i+1,i,40,40+i,40+i+1);
 const bodyGeo=new T.BufferGeometry();bodyGeo.setAttribute('position',new T.Float32BufferAttribute(positions,3));bodyGeo.setIndex(indices);bodyGeo.computeVertexNormals();const shell=mesh(g,bodyGeo,paint);shell.material.side=T.DoubleSide;
 function pane(points,mat=glass,p=g){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(points.flat(),3));geo.setIndex([0,1,2,0,2,3]);geo.computeVertexNormals();return mesh(p,geo,mat);}
 const cabinTop=variant==='supercar'?1.6:1.72;pane([[-.83,1.08,-.94],[.83,1.08,-.94],[.7,cabinTop,-.48],[-.7,cabinTop,-.48]]);pane([[-.83,1.09,1.23],[-.7,cabinTop,.77],[.7,cabinTop,.77],[.83,1.09,1.23]]);
 const roof=box(g,1.49,.09,1.3,paint,0,cabinTop+.03,.15);for(const side of [-1,1]){pane([[side*.84,1.1,-.91],[side*.71,cabinTop-.02,-.47],[side*.71,cabinTop-.02,.8],[side*.84,1.1,1.2]]);box(g,.07,cabinTop-1.11,.06,paint,side*.77,(cabinTop+1.1)/2,.35);box(g,.09,.06,1.7,chrome,side*.97,1.12,.1);const mirror=box(g,.28,.14,.28,paint,side*1.1,1.27,-.65);box(g,.02,.1,.2,chrome,side*1.25,1.27,-.61);}
 const wheels=[];for(const side of [-1,1])for(const z of [-1.35,1.35]){const wheel=new T.Group();wheel.position.set(side*.98,.4,z);g.add(wheel);const tire=mesh(wheel,new T.CylinderGeometry(.38,.38,.22,28),rubber);tire.rotation.z=Math.PI/2;const hub=mesh(wheel,new T.CylinderGeometry(.25,.25,.23,24),chrome);hub.rotation.z=Math.PI/2;const inset=mesh(wheel,new T.CylinderGeometry(.2,.2,.24,20),trim);inset.rotation.z=Math.PI/2;for(let i=0;i<5;i++){const spoke=box(wheel,.25,.035,.35,chrome,0,0,0);spoke.rotation.x=i*Math.PI/5;}wheels.push(wheel);}
 const light=new T.MeshStandardMaterial({color:0xebf4e7,emissive:0xb9d3c6,emissiveIntensity:.3,roughness:.15});for(const x of [-.63,.63]){box(g,.45,.14,.06,light,x,.87,-2.08);box(g,.4,.1,.05,new T.MeshStandardMaterial({color:0xc0312d}),x,.9,2.02);}box(g,.72,.2,.06,trim,0,.68,-2.15);for(let i=0;i<5;i++)box(g,.66,.012,.02,chrome,0,.61+i*.035,-2.19);box(g,1.6,.04,.05,chrome,0,.54,-2.09);box(g,.4,.12,.02,chrome,0,.68,2.07);
 addCarSeats(g);box(g,1.6,.08,.28,trim,0,1.02,-.69);box(g,1.7,.05,1.8,trim,0,.48,.1);
 const steering=createSteeringWheel(g);
 const door=new T.Group();door.position.set(-1,0,-.8);g.add(door);box(door,.06,.48,1.13,paint,0,.9,.565);box(door,.025,.4,1.05,glass,0,1.4,.565);box(door,.07,.035,.18,chrome,-.05,1.07,.95);
 g.userData.variant=variant;if(variant==='supercar'){
  g.name='Lamborghini inspired V12 supercar';glass.opacity=.19;for(const seat of g.getObjectsByProperty('name','Upholstered front car seat'))seat.children[2].position.y=1.43;paint.color.setHex(0xe6b42c);paint.roughness=.2;roof.material=trim;roof.scale.x=.94;
  box(g,2.03,.07,.28,trim,0,.48,-2.1);box(g,1.92,.07,.27,trim,0,.55,2.07);
  for(const side of [-1,1]){pane([[side*1.045,.53,-.2],[side*1.045,.9,.15],[side*1.045,.95,.83],[side*1.045,.56,.7]],trim);for(const [dx,dy,angle]of [[0,0,0],[-.07,.025,.65],[.07,.025,-.65]]){const led=box(g,.018,.1,.025,light,side*.7+dx,.77+dy,-2.14);led.rotation.z=angle;}box(g,.36,.11,.03,trim,side*.5,.83,2.08);}
  // Rear engine louvers, hexagonal exhausts and wheel hardware follow supercar proportions.
  for(let i=0;i<7;i++){const vent=box(g,1.12,.025,.065,trim,0,1.01,1.04+i*.105);vent.rotation.x=-.14;}
  for(const side of [-1,1]){
   const exhaust=mesh(g,new T.CylinderGeometry(.105,.105,.16,6),chrome,side*.22,.68,2.12);exhaust.rotation.x=Math.PI/2;
   const bore=mesh(g,new T.CylinderGeometry(.077,.077,.165,6),trim,side*.22,.68,2.13);bore.rotation.x=Math.PI/2;
   for(const z of [-1.35,1.35]){const disc=mesh(g,new T.CylinderGeometry(.205,.205,.028,24),chrome,side*1.105,.4,z);disc.rotation.z=Math.PI/2;box(g,.034,.15,.09,new T.MeshStandardMaterial({color:0xbd3228,roughness:.4}),side*1.127,.43,z-.14);}
   box(g,.05,.1,1.72,trim,side*1.03,.47,.15);
  }
  const console=box(g,.22,.25,.74,trim,0,.72,-.1);console.name='Carbon centre console';for(let i=0;i<4;i++)box(g,.038,.018,.07,chrome,-.075+i*.05,.856,-.26);const startCover=box(g,.07,.035,.08,new T.MeshStandardMaterial({color:0xb53025,metalness:.4,roughness:.3}),0,.87,-.08);startCover.rotation.x=-.2;
  const spoiler=box(g,1.85,.06,.3,trim,0,1.12,1.88);for(const x of [-.6,.6])box(g,.05,.19,.06,chrome,x,1.0,1.88);
  door.position.y=1;for(const part of door.children)part.position.y-=1;door.userData.scissor=true;
 }else if(variant==='compact'){g.scale.set(.93,.95,.84);}else if(variant==='coupe'){g.scale.set(1,.87,1.04);}else if(variant==='suv'){g.scale.set(1.08,1.12,1.03);for(const x of [-.58,.58])box(g,.05,.08,1.5,chrome,x,1.86,.15);}else if(variant==='van'){g.scale.set(1.03,1.08,1.08);box(g,1.65,.62,1.3,paint,0,1.42,.72);for(const x of [-.84,.84])box(g,.02,.33,1.02,glass,x,1.48,.75);}
 const indicators=addTurnDisplay(g);return{g,door,wheels,steering,indicators,openDoor(u){if(door.userData.scissor)door.rotation.x=-u*1.15;else door.rotation.y=-u*1.25;}};
}
export function addStreetHouse(parent,x,z,color=0xbaa58b,turn=0){
 const g=new T.Group();g.name='Neighbourhood home';g.position.set(x,0,z);g.rotation.y=turn;parent.add(g);
 const wall=new T.MeshStandardMaterial({color,roughness:.85}),roofMat=new T.MeshStandardMaterial({color:0x645148,roughness:.9}),glass=new T.MeshStandardMaterial({color:0x6c939f,roughness:.2}),white=new T.MeshStandardMaterial({color:0xe4ddc8});
 const box=(w,h,d,m,x,y,z)=>mesh(g,new T.BoxGeometry(w,h,d),m,x,y,z);
 box(6,3.5,5,wall,0,1.75,0);const roof=new T.BufferGeometry();roof.setAttribute('position',new T.Float32BufferAttribute([-3.5,3.5,-3,3.5,3.5,-3,0,5,-3,-3.5,3.5,3,0,5,3,3.5,3.5,3],3));roof.setIndex([0,2,1,3,5,4,0,3,4,0,4,2,1,2,4,1,4,5]);roof.computeVertexNormals();mesh(g,roof,roofMat);
 box(1,2.4,.1,new T.MeshStandardMaterial({color:0x526561}),0,1.2,2.56);for(const sx of [-1.9,1.9]){box(1.1,1.25,.06,glass,sx,2,2.54);box(1.3,.07,.12,white,sx,1.36,2.6);box(.05,1.25,.1,white,sx,2,2.59);box(1.1,.05,.1,white,sx,2,2.59);}box(1.8,.1,1,white,0,.05,2.9);box(.45,1,.5,roofMat,1.8,4.1,-.5);
 // Porch, drainage, side windows and planted gardens give the houses depth.
 box(2.4,.12,1.25,white,0,2.8,2.95);for(const sx of [-1.05,1.05])box(.09,2.7,.09,white,sx,1.35,3.35);for(let i=0;i<3;i++)box(2.2-i*.15,.12,1.2-i*.2,white,0,.06+i*.12,3.2-i*.12);
 for(const side of [-1,1]){box(.08,.08,5.6,white,side*3.2,3.48,0);box(.05,3,.05,white,side*2.92,1.5,2.65);for(const sz of [-1.3,1.1]){box(.05,1.1,1.1,glass,side*3.03,2,sz);box(.08,.05,1.25,white,side*3.07,1.43,sz);box(.08,1.1,.04,white,side*3.07,2,sz);}}
 for(const sx of [-1.9,1.9])for(const side of [-1,1])box(.2,1.4,.09,roofMat,sx+side*.7,2,2.64);
 const garden=new T.MeshStandardMaterial({color:0x4b704e,roughness:1});for(const sx of [-2.3,2.3]){box(1.3,.17,.8,roofMat,sx,.12,3);for(let i=0;i<3;i++)mesh(g,new T.SphereGeometry(.28,10,8),garden,sx-.4+i*.4,.45,3);}
 for(let x=-3;x<=3;x+=.5)if(Math.abs(x)>1.15)box(.07,.7,.07,white,x,.35,4.4);for(const x of [-2.2,2.2])box(2,.06,.05,white,x,.55,4.4);box(.12,.9,.12,roofMat,2.6,.45,4.6);box(.4,.24,.27,white,2.6,1,4.6);
 for(let z=-2.6;z<2.7;z+=.35)box(6.4,.015,.025,roofMat,0,3.52,z);

 return g;
}
