import {FLOOR_HEIGHT as H} from './house-world.js';
export function buildSpiderLab({THREE,scene,box,solid,label,glow}){
 // A physical paper note lies on the worktable beside the containment area.
 solid(2.5,.14,1.2,0x68523b,5,H+.95,-15.4);for(const x of [4,6])for(const z of [-15.85,-14.95])box(.1,.9,.1,0x40372b,x,H+.45,z);
 const paperCanvas=document.createElement('canvas');paperCanvas.width=1024;paperCanvas.height=640;const ctx=paperCanvas.getContext('2d');ctx.fillStyle='#d9ccaa';ctx.fillRect(0,0,1024,640);ctx.strokeStyle='#948269';ctx.lineWidth=5;ctx.strokeRect(25,25,974,590);ctx.direction='rtl';ctx.textAlign='center';ctx.fillStyle='#302d27';ctx.font='bold 70px Arial';ctx.fillText('הכלים שתצטרך',512,150);ctx.font='52px Arial';ctx.fillText('פנס — כדי שיהיה אור',512,300);ctx.fillText('גרזן — כדי לברוח מהבית',512,420);const paperTexture=new THREE.CanvasTexture(paperCanvas);paperTexture.colorSpace=THREE.SRGBColorSpace;const paper=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.92),new THREE.MeshStandardMaterial({map:paperTexture,roughness:1}));paper.name='Laboratory tools note';paper.position.set(5,H+1.025,-15.4);paper.rotation.x=-Math.PI/2;scene.add(paper);

 const metal=new THREE.MeshStandardMaterial({color:0x344448,metalness:.65,roughness:.42});
 const glass=new THREE.MeshPhysicalMaterial({color:0x8cc5c9,transparent:true,opacity:.2,roughness:.15,metalness:.05,side:THREE.DoubleSide,depthWrite:false});
 const cyan=new THREE.MeshBasicMaterial({color:0x63b9bb}),dark=new THREE.MeshStandardMaterial({color:0x101b21,roughness:.65});
 // The containment chamber is large enough for the monster. Its front has a torn opening.
 const tank=solid(5,.24,5,metal,9,H+.12,-21);tank.name='Broken containment chamber';solid(5,.15,5,metal,9,H+3.15,-21);
 for(const x of [6.5,11.5])for(const z of [-23.5,-18.5])solid(.12,3.1,.12,metal,x,H+1.65,z);
 solid(.06,2.9,4.8,glass,6.55,H+1.68,-21);solid(.06,2.9,4.8,glass,11.45,H+1.68,-21);solid(4.8,2.9,.06,glass,9,H+1.68,-23.45);
 function shard(points){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));g.computeVertexNormals();const m=new THREE.Mesh(g,glass);m.name='Broken glass shard';scene.add(m);return m;}
 const z=-18.48;
 for(const p of [[[6.6,H+.26,z],[7.45,H+.26,z],[6.6,H+2.4,z]],[[6.6,H+3.05,z],[8.1,H+3.05,z],[6.6,H+2.1,z]],[[11.4,H+.26,z],[10.55,H+.26,z],[11.4,H+2.3,z]],[[11.4,H+3.05,z],[9.7,H+3.05,z],[11.4,H+1.8,z]]])shard(p);
 for(let i=0;i<12;i++){const x=7.3+(i%4)*.9,zz=-18.1+Math.floor(i/4)*.48;shard([[x,H+.025,zz],[x+.34,H+.025,zz+.2],[x-.12,H+.025,zz+.38]]);}
 for(const x of [6.8,11.2])box(.055,.035,4.4,cyan,x,H+.27,-21);
 label('ניסוי 08 — תא הכליאה',9,H+3.35,-18.4,0,'#80d6d0',4);
 label('התא נפרץ',9,H+2.7,-23.35,0,'#e99c72',2.6);
 // A scuffed restraint table and empty straps inside the chamber.
 box(2.5,.18,2.8,metal,9,H+.62,-21);for(const x of [8,10])box(.13,.55,2.4,metal,x,H+.3,-21);for(const z of [-21.8,-20.2])box(2.6,.045,.16,0x3c3028,9,H+.73,z);
 // Computer workstations face the player approaching from the room's south entrance.
 for(const x of [7.4,9.8]){solid(2,.12,1.1,metal,x,H+.93,-8);for(const dx of [-.8,.8])box(.1,.9,.9,metal,x+dx,H+.45,-8);box(1.65,1.03,.15,dark,x,H+1.65,-8.3);box(.14,.35,.15,metal,x,H+1.13,-8.3);box(1.45,.83,.02,0x12383c,x,H+1.65,-8.21);box(1,.04,.35,dark,x,H+1.03,-7.8);for(let i=0;i<9;i++)box(.07,.012,.07,0x6c7e7e,x-.4+i*.1,H+1.058,-7.85);
 label(x<8?'פרויקט: עכביש ענק':'קשר עם התא: אבד',x,H+1.85,-8.18,0,'#90dfcd',1.35);
 const wave=[];for(let i=0;i<34;i++){const xx=x-.65+i*.04,yy=H+1.43+Math.sin(i*.7)*.08+(i%13===0?.14:0);wave.push(xx,yy,-8.17);}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(wave,3));scene.add(new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x63d0a4})));}
 // A clean anatomical skull specimen, with dark sockets and no gore.
 const skull=new THREE.Group();skull.name='Anatomical skull specimen';skull.position.set(8.7,H+1.12,-13.5);scene.add(skull);
 const bone=new THREE.MeshStandardMaterial({color:0xd1c8a7,roughness:.88}),socket=new THREE.MeshStandardMaterial({color:0x24282a,roughness:1});
 function orb(x,y,z,sx,sy,sz,material){const m=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);skull.add(m);return m;}
 orb(0,.32,0,.27,.31,.25,bone);orb(0,.12,.08,.2,.11,.2,bone);for(const side of [-1,1])orb(side*.105,.34,.218,.075,.087,.035,socket);orb(0,.23,.247,.033,.05,.018,socket);for(let i=0;i<6;i++)box(.035,.065,.055,bone,(i-2.5)*.047,.115,.255,skull);
 label('דגימת שלד',8.7,H+1.06,-13.04,0,'#d6c6a3',.8);
 label('יומן ניסוי 08',9,H+2.8,-26.78,0,'#9acbc5',3.8);label('הגדילה הצליחה. הכליאה נכשלה.',9,H+2.25,-26.77,0,'#d7b89b',5.4);
 // Server rack, bundled cables, and a steady warning light.
 solid(1.2,2.7,1,metal,11.7,H+1.35,-10.5);for(let i=0;i<7;i++){box(1,.24,.04,dark,11.7,H+.35+i*.33,-9.97);box(.06,.035,.02,cyan,12,H+.35+i*.33,-9.94);}
 for(let i=0;i<3;i++){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(11.7+i*.08,H+.06,-10),new THREE.Vector3(12.2+i*.06,H+.06,-14),new THREE.Vector3(12.1+i*.06,H+.06,-20),new THREE.Vector3(11.5,H+.3,-21)]);scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve,24,.025,5,false),dark));}
 glow(0x74b9c9,3,10,9,H+2.7,-21);glow(0x75c5bb,2,7,9,H+2.4,-8);glow(0xe88c52,1.5,6,6.8,H+2.8,-18.5);
}
