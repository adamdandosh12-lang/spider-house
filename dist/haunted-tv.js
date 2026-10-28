import * as THREE from './vendor/three.module.js';
export function tvPhase(time){const t=((time%28)+28)%28;return t<12?'off':t<14?'static':t<20?'spider':t<22?'static':'off';}
export function addHauntedTV({scene,box,sphere,label}){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=320;const ctx=canvas.getContext('2d');const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 // Screen overlays the existing television cabinet in the ground-floor living room.
 const screen=new THREE.Mesh(new THREE.PlaneGeometry(1.65,.91),new THREE.MeshBasicMaterial({map:texture}));screen.position.set(11,1.6,-3.63);screen.userData.dynamic=true;screen.name='Haunted television screen';scene.add(screen);
 label('אין אות',11,.96,-3.62,0,'#a1a69b',.65);
 const glow=new THREE.PointLight(0x7caaa9,0,6);glow.position.set(11,1.7,-3.1);scene.add(glow);
 const silk=[];for(let i=0;i<10;i++){silk.push(12.4,2.9,-3.4,10.1+i*.22,1.03,-3.48);if(i<9)silk.push(10.1+i*.22,1.03,-3.48,10.32+i*.22,1.14,-3.48);}const webGeo=new THREE.BufferGeometry();webGeo.setAttribute('position',new THREE.Float32BufferAttribute(silk,3));scene.add(new THREE.LineSegments(webGeo,new THREE.LineBasicMaterial({color:0x9baaa3,transparent:true,opacity:.45})));
 // A few abandoned objects, loose papers and mirror fragments, all below ankle height.
 for(let i=0;i<7;i++){const x=6.2+(i%3)*.65,z=2.7+Math.floor(i/3)*.3;const paper=box(.38,.012,.28,i%2?0x80745f:0x4a514a,x,.026,z);paper.rotation.y=i*1.1;}
 const mirrorMat=new THREE.MeshStandardMaterial({color:0x81989b,metalness:.7,roughness:.25,side:THREE.DoubleSide});for(let i=0;i<9;i++){const x=10.2+(i%3)*.43,z=2.8+Math.floor(i/3)*.3;const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute([x,.03,z,x+.26,.03,z+.1,x+.07,.03,z+.27],3));geo.computeVertexNormals();scene.add(new THREE.Mesh(geo,mirrorMat));}
 const stain=new THREE.Mesh(new THREE.CircleGeometry(.27,15),new THREE.MeshStandardMaterial({color:0x4a2020,roughness:1}));stain.rotation.x=-Math.PI/2;stain.position.set(8.4,.018,3.1);stain.scale.set(1,.62,1);stain.name='Small faded blood stain';scene.add(stain);
 const skull=new THREE.Group();skull.name='Living room skull';skull.position.set(7.1,.07,3.2);skull.rotation.y=-.45;scene.add(skull);sphere(.23,0xbfb59b,0,.23,0,skull,1,1.08,.9);sphere(.14,0xbfb59b,0,.08,.05,skull,1,.5,1);for(const side of [-1,1])sphere(.063,0x222621,side*.087,.25,.183,skull,1,1.15,.4);sphere(.033,0x222621,0,.16,.206,skull,.7,1,.4);for(let i=0;i<5;i++)box(.035,.05,.04,0xbfb59b,(i-2)*.044,.075,.18,skull);
 let lastPhase='',lastFrame=-1;
 function draw(phase,time){ctx.fillStyle='#11191b';ctx.fillRect(0,0,512,320);
 if(phase==='static'){for(let i=0;i<32;i++){const v=24+Math.floor((Math.sin(i*19+Math.floor(time*5))* .5+.5)*47);ctx.fillStyle='rgb('+v+','+v+','+v+')';ctx.fillRect(0,i*10,512,7);}}
 if(phase==='spider'){ctx.fillStyle='#46595a';ctx.fillRect(0,0,512,320);ctx.strokeStyle='#111516';ctx.lineWidth=18;for(const side of [-1,1])for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(256+side*30,178);ctx.lineTo(256+side*(100+i*13),48+i*56);ctx.lineTo(256+side*(170+i*8),30+i*85);ctx.stroke();}ctx.fillStyle='#101415';ctx.beginPath();ctx.ellipse(256,125,65,85,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(256,208,51,42,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ae7157';for(const side of [-1,1])for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(256+side*(9+i*9),208+Math.abs(i-1)*7,4,0,Math.PI*2);ctx.fill();}}
 if(phase!=='off'){ctx.fillStyle='#0b111338';for(let y=0;y<320;y+=5)ctx.fillRect(0,y,512,1);}texture.needsUpdate=true;
 }
 return{screen,glow,reset(){lastPhase='';lastFrame=-1;draw('off',0);glow.intensity=0;},update(time){const phase=tvPhase(time),frame=Math.floor(time*5),turnedOn=lastPhase==='off'&&phase!=='off';if(phase!==lastPhase||(phase==='static'&&frame!==lastFrame))draw(phase,time);lastFrame=frame;lastPhase=phase;glow.intensity=phase==='off'?0:phase==='static'?.35:.75;return turnedOn;}};
}
