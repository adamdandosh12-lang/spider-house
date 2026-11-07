import * as T from './vendor/three.module.js';
function mesh(parent,geo,mat,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;}
export function createStreetCar(parent,color=0x2e626a){
 const g=new T.Group();g.name='Detailed street sedan';parent.add(g);
 const paint=new T.MeshPhysicalMaterial({color,roughness:.28,metalness:.5,clearcoat:.8,clearcoatRoughness:.22}),rubber=new T.MeshStandardMaterial({color:0x171c20,roughness:.9}),chrome=new T.MeshStandardMaterial({color:0xaeb8bf,roughness:.22,metalness:.8}),glass=new T.MeshPhysicalMaterial({color:0x83aebb,transparent:true,opacity:.38,roughness:.1,depthWrite:false,side:T.DoubleSide}),trim=new T.MeshStandardMaterial({color:0x253139,roughness:.6});
 const box=(p,w,h,d,mat,x,y,z)=>mesh(p,new T.BoxGeometry(w,h,d),mat,x,y,z);
 // Sculpted body cross sections soften the hood, boot and bumpers.
 const rings=[[-2.16,.76,.56,.88],[-1.78,.96,.56,1.04],[-.95,1,.57,1.09],[.95,1,.57,1.1],[1.8,.94,.58,1.02],[2.05,.78,.61,.91]],positions=[],indices=[];
 for(const [z,w,b,t]of rings)for(const [x,y]of [[-w*.84,b],[-w,b+.1],[-w,t-.07],[-w*.86,t],[w*.86,t],[w,t-.07],[w,b+.1],[w*.84,b]])positions.push(x,y,z);
 for(let r=0;r<rings.length-1;r++)for(let i=0;i<8;i++){const a=r*8+i,b=r*8+(i+1)%8,c=b+8,d=a+8;indices.push(a,b,c,a,c,d);}for(let i=1;i<7;i++)indices.push(0,i+1,i,40,40+i,40+i+1);
 const bodyGeo=new T.BufferGeometry();bodyGeo.setAttribute('position',new T.Float32BufferAttribute(positions,3));bodyGeo.setIndex(indices);bodyGeo.computeVertexNormals();const shell=mesh(g,bodyGeo,paint);shell.material.side=T.DoubleSide;
 function pane(points,mat=glass,p=g){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(points.flat(),3));geo.setIndex([0,1,2,0,2,3]);geo.computeVertexNormals();return mesh(p,geo,mat);}
 pane([[-.83,1.08,-.94],[.83,1.08,-.94],[.7,1.72,-.48],[-.7,1.72,-.48]]);pane([[-.83,1.09,1.23],[-.7,1.72,.77],[.7,1.72,.77],[.83,1.09,1.23]]);
 const roof=box(g,1.49,.09,1.3,paint,0,1.75,.15);for(const side of [-1,1]){pane([[side*.84,1.1,-.91],[side*.71,1.7,-.47],[side*.71,1.7,.8],[side*.84,1.1,1.2]]);box(g,.07,.61,.06,paint,side*.77,1.4,.35);box(g,.09,.06,1.7,chrome,side*.97,1.12,.1);const mirror=box(g,.28,.14,.28,paint,side*1.1,1.27,-.65);box(g,.02,.1,.2,chrome,side*1.25,1.27,-.61);}
 const wheels=[];for(const side of [-1,1])for(const z of [-1.35,1.35]){const wheel=new T.Group();wheel.position.set(side*.98,.4,z);g.add(wheel);const tire=mesh(wheel,new T.CylinderGeometry(.38,.38,.22,28),rubber);tire.rotation.z=Math.PI/2;const hub=mesh(wheel,new T.CylinderGeometry(.25,.25,.23,24),chrome);hub.rotation.z=Math.PI/2;const inset=mesh(wheel,new T.CylinderGeometry(.2,.2,.24,20),trim);inset.rotation.z=Math.PI/2;for(let i=0;i<5;i++){const spoke=box(wheel,.25,.035,.35,chrome,0,0,0);spoke.rotation.x=i*Math.PI/5;}wheels.push(wheel);}
 const light=new T.MeshStandardMaterial({color:0xebf4e7,emissive:0xb9d3c6,emissiveIntensity:.3,roughness:.15});for(const x of [-.63,.63]){box(g,.45,.14,.06,light,x,.87,-2.08);box(g,.4,.1,.05,new T.MeshStandardMaterial({color:0xc0312d}),x,.9,2.02);}box(g,.72,.2,.06,trim,0,.68,-2.15);for(let i=0;i<5;i++)box(g,.66,.012,.02,chrome,0,.61+i*.035,-2.19);box(g,1.6,.04,.05,chrome,0,.54,-2.09);box(g,.4,.12,.02,chrome,0,.68,2.07);
 for(const x of [-.43,.43]){box(g,.6,.19,.65,trim,x,.7,.3);box(g,.6,.65,.15,trim,x,1.06,.62);}box(g,1.6,.18,.37,trim,0,1.05,-.64);
 const steering=mesh(g,new T.TorusGeometry(.19,.025,8,24),trim,-.43,1.25,-.35);steering.rotation.x=-.3;
 const door=new T.Group();door.position.set(-1,0,-.8);g.add(door);box(door,.06,.48,1.13,paint,0,.9,.565);box(door,.025,.4,1.05,glass,0,1.4,.565);box(door,.07,.035,.18,chrome,-.05,1.07,.95);
 return{g,door,wheels};
}
export function addStreetHouse(parent,x,z,color=0xbaa58b,turn=0){
 const g=new T.Group();g.name='Neighbourhood home';g.position.set(x,0,z);g.rotation.y=turn;parent.add(g);
 const wall=new T.MeshStandardMaterial({color,roughness:.85}),roofMat=new T.MeshStandardMaterial({color:0x645148,roughness:.9}),glass=new T.MeshStandardMaterial({color:0x6c939f,roughness:.2}),white=new T.MeshStandardMaterial({color:0xe4ddc8});
 const box=(w,h,d,m,x,y,z)=>mesh(g,new T.BoxGeometry(w,h,d),m,x,y,z);
 box(6,3.5,5,wall,0,1.75,0);const roof=new T.BufferGeometry();roof.setAttribute('position',new T.Float32BufferAttribute([-3.5,3.5,-3,3.5,3.5,-3,0,5,-3,-3.5,3.5,3,0,5,3,3.5,3.5,3],3));roof.setIndex([0,2,1,3,5,4,0,3,4,0,4,2,1,2,4,1,4,5]);roof.computeVertexNormals();mesh(g,roof,roofMat);
 box(1,2.4,.1,new T.MeshStandardMaterial({color:0x526561}),0,1.2,2.56);for(const sx of [-1.9,1.9]){box(1.1,1.25,.06,glass,sx,2,2.54);box(1.3,.07,.12,white,sx,1.36,2.6);box(.05,1.25,.1,white,sx,2,2.59);box(1.1,.05,.1,white,sx,2,2.59);}box(1.8,.1,1,white,0,.05,2.9);box(.45,1,.5,roofMat,1.8,4.1,-.5);
 return g;
}
