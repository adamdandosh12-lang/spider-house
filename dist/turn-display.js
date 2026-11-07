import * as T from './vendor/three.module.js';
export function addTurnDisplay(car){
 const canvas=document.createElement('canvas');canvas.width=320;canvas.height=160;const ctx=canvas.getContext('2d'),texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
 const bezel=new T.Mesh(new T.BoxGeometry(.34,.18,.025),new T.MeshStandardMaterial({color:0x111b20,roughness:.5}));bezel.position.set(-.25,1.12,-.65);car.add(bezel);
 const screen=new T.Mesh(new T.PlaneGeometry(.31,.15),new T.MeshBasicMaterial({map:texture}));screen.position.set(-.25,1.12,-.632);car.add(screen);
 const lamps=[];for(const side of [-1,1])for(const z of [-2.12,2.06]){const light=new T.Mesh(new T.BoxGeometry(.13,.065,.025),new T.MeshBasicMaterial({color:0x49351d}));light.position.set(side*.82,.86,z);car.add(light);lamps.push({light,side});}
 let stamp='',state={direction:null,lit:false};
 function update(direction,time){const lit=!!direction&&time%1<.5,key=String(direction)+lit;if(key===stamp)return state;stamp=key;state={direction:direction||null,lit};ctx.fillStyle='#07151c';ctx.fillRect(0,0,320,160);ctx.strokeStyle='#486572';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(70,140);ctx.lineTo(140,35);ctx.moveTo(250,140);ctx.lineTo(180,35);ctx.stroke();ctx.fillStyle='#8babb2';ctx.font='18px Arial';ctx.textAlign='center';ctx.fillText('DRIVE',160,150);
  if(lit){ctx.save();ctx.translate(160,69);if(direction==='right')ctx.scale(-1,1);ctx.fillStyle='#56f393';ctx.beginPath();ctx.moveTo(-75,0);ctx.lineTo(-20,-38);ctx.lineTo(-20,-17);ctx.lineTo(65,-17);ctx.lineTo(65,17);ctx.lineTo(-20,17);ctx.lineTo(-20,38);ctx.closePath();ctx.fill();ctx.restore();}
  for(const p of lamps)p.light.material.color.setHex(lit&&p.side===(direction==='left'?-1:1)?0xffa128:0x49351d);texture.needsUpdate=true;return state;
 }
 update(null,0);return{screen,update,get state(){return state;}};
}
