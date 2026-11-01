export function buildHatchingRoom({THREE,scene,box,solid,label,glow}){const H=4.2,slabs=[];
 function floor(w,d,x,z){box(w,.22,d,0x383331,x,H-.11,z);slabs.push({x,z,w,d,bottom:H-.22,top:H});box(w,.16,d,0x252729,x,H+3.65,z);}
 floor(3.4,7,0,-30.5);floor(18,15,0,-41.5);
 for(const x of [-1.8,1.8])solid(.2,3.6,7,0x453738,x,H+1.8,-30.5);solid(.25,3.6,15,0x443d3b,-9,H+1.8,-41.5);solid(.25,3.6,6,0x443d3b,9,H+1.8,-46);solid(.25,3.6,6,0x443d3b,9,H+1.8,-37);solid(18,3.6,.25,0x443d3b,0,H+1.8,-49);for(const x of [-5.4,5.4])solid(7.2,3.6,.25,0x443d3b,x,H+1.8,-34);
 label('אגף הבקיעה',0,H+2.8,-27.1,0,'#da9687',2.8);label('הוא כבר לא בפנים',0,H+2.9,-48.8,0,'#c08a7b',4.5);
 const red=new THREE.MeshStandardMaterial({color:0x631c18,emissive:0xff3020,emissiveIntensity:1}),lamps=[];
 for(const z of [-28.5,-31,-33.3]){box(.65,.12,.35,0x302d2b,0,H+3.35,z);box(.44,.08,.22,red,0,H+3.25,z);lamps.push(glow(0xff392b,2,7,0,H+3.1,z));}glow(0xac8c7f,4,15,0,H+3,-42);
 // Hollow broken shell, with an irregular rim and empty dark interior.
 const shellMat=new THREE.MeshStandardMaterial({color:0xaaa28a,roughness:1,side:THREE.DoubleSide});const shell=new THREE.Mesh(new THREE.SphereGeometry(1,32,24,0,Math.PI*2,.9,Math.PI-.9),shellMat);shell.name='Giant hatched spider egg';shell.userData.dynamic=true;shell.position.set(0,H+1.8,-42);shell.scale.set(1.6,1.7,1.5);shell.castShadow=true;scene.add(shell);
 const vertices=[];for(let i=0;i<20;i++){const a=i/20*Math.PI*2,b=(i+1)/20*Math.PI*2,m=(a+b)/2;vertices.push(Math.cos(a)*1.25,H+2.85,-42+Math.sin(a)*1.18,Math.cos(b)*1.25,H+2.85,-42+Math.sin(b)*1.18,Math.cos(m)*(1.05+(i%3)*.07),H+3.02+(i%3)*.15,-42+Math.sin(m)*1.12);}const rimGeo=new THREE.BufferGeometry();rimGeo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));rimGeo.computeVertexNormals();scene.add(new THREE.Mesh(rimGeo,shellMat));
 solid(2.9,.7,2.8,0x39372f,0,H+.35,-42);
 for(let i=0;i<9;i++){const a=i*2.4,x=Math.cos(a)*(2+i*.13),z=-42+Math.sin(a)*(2+i*.13);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([x,H+.03,z,x+.4,H+.04,z+.2,x-.15,H+.22,z+.5],3));g.computeVertexNormals();scene.add(new THREE.Mesh(g,shellMat));}
 const web=[];for(const x of [-8.7,8.7])for(const z of [-34.3,-48.7]){const sx=-Math.sign(x),sz=z< -40?1:-1;for(let i=0;i<=14;i++){const a=i/14*Math.PI/2;web.push(x,H+3.4,z,x+sx*Math.cos(a)*4,H+3.1,z+sz*Math.sin(a)*4);}for(let j=1;j<10;j++)for(let i=0;i<14;i++){const a=i/14*Math.PI/2,b=(i+1)/14*Math.PI/2;web.push(x+sx*Math.cos(a)*j*.4,H+3.25,z+sz*Math.sin(a)*j*.4,x+sx*Math.cos(b)*j*.4,H+3.25,z+sz*Math.sin(b)*j*.4);}}
 for(let i=0;i<24;i++){const a=i/24*Math.PI*2;web.push(Math.cos(a)*1.6,H+1.5,-42+Math.sin(a)*1.5,Math.cos(a)*3.8,H+.04,-42+Math.sin(a)*3.8);}
 const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute(web,3));scene.add(new THREE.LineSegments(wg,new THREE.LineBasicMaterial({color:0xc1bdae,transparent:true,opacity:.5})));
 const stainMat=new THREE.MeshStandardMaterial({color:0x492122,roughness:1});for(let i=0;i<11;i++){const a=i*2.4,m=new THREE.Mesh(new THREE.CircleGeometry(.3+(i%3)*.16,12),stainMat);m.rotation.x=-Math.PI/2;m.position.set(Math.cos(a)*3.1,H+.016,-42+Math.sin(a)*3.8);m.scale.x=1.4;scene.add(m);}
 return{slabs,lamps,update(time){const power=Math.max(0,Math.sin(time*.65));for(const l of lamps)l.intensity=power*2.8;red.emissiveIntensity=power*1.3;}};
}
