export function wardrobeBuilder({THREE,box,colliders,hides,label}){
 const size=64,pixels=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++){let v=52+Math.sin(x*.8+Math.sin(y*.08)*.6)*9+Math.sin(x*2.4+y*.025)*4;pixels.set([v*1.35,v,v*.68,255],(y*size+x)*4);}const map=new THREE.DataTexture(pixels,size,size);map.colorSpace=THREE.SRGBColorSpace;map.needsUpdate=true;
 const wood=new THREE.MeshStandardMaterial({map,roughness:.82}),trim=new THREE.MeshStandardMaterial({color:0x3c2d21,roughness:.72}),brass=new THREE.MeshStandardMaterial({color:0xa68b57,roughness:.4,metalness:.65});
 return function wardrobe(x,y,z,name){
 box(1.3,2.8,.1,wood,x,y+1.4,z-.55);for(const side of [-1,1])box(.09,2.8,1.2,wood,x+side*.605,y+1.4,z);
 for(const h of [.12,2.73])box(1.4,.14,1.28,trim,x,y+h,z);box(1.25,.08,1.05,wood,x,y+1.85,z);
 for(const side of [-1,1]){const cx=x+side*.32;box(.60,2.5,.065,wood,cx,y+1.42,z+.61);for(const dx of [-.25,.25])box(.055,2.42,.035,trim,cx+dx,y+1.42,z+.66);for(const h of [.3,1.02,2.55])box(.53,.05,.035,trim,cx,y+h,z+.66);
 for(let h=1.72;h<2.4;h+=.1){const slat=box(.45,.045,.035,trim,cx,y+h,z+.67);slat.rotation.x=.2;}box(.035,.18,.07,brass,x+side*.07,y+1.37,z+.7);for(const h of [.6,2.25])box(.045,.12,.03,brass,x+side*.61,y+h,z+.66);}
 label(name,x,y+2.64,z+.71,0,'#b9aa88',.65);
 colliders.push({x,z,w:1.3,d:1.2,bottom:y,top:y+2.8});hides.push({x,y,z,name});
 };}
