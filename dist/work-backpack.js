import * as T from './vendor/three.module.js';
import {roundedBoxGeometry} from './car-surfaces.js';

export function createWorkBackpack(){
 const bag=new T.Group();bag.name='Wearable work backpack';
 const weave=new Uint8Array(64*64*4),height=new Uint8Array(64*64*4);
 for(let y=0;y<64;y++)for(let x=0;x<64;x++){
  const i=(y*64+x)*4,thread=((x%4<2)!==(y%4<2))?1:0,grain=Math.sin(x*17.1+y*9.7)*3,v=thread?155:112;
  weave.set([v+grain,v+grain,v+grain,255],i);height.set([thread?166:108,thread?166:108,thread?166:108,255],i);
 }
 const texture=new T.DataTexture(weave,64,64,T.RGBAFormat),bump=new T.DataTexture(height,64,64,T.RGBAFormat);
 for(const map of [texture,bump]){map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(5,6);map.needsUpdate=true;}texture.colorSpace=T.SRGBColorSpace;
 const cloth=new T.MeshStandardMaterial({color:0x5b7775,map:texture,bumpMap:bump,bumpScale:.0018,roughness:.94});
 const pocketMat=cloth.clone();pocketMat.color.set(0x627f7c);
 const webbing=new T.MeshStandardMaterial({color:0x283c3d,map:texture,roughness:1,side:T.DoubleSide});
 const rubber=new T.MeshStandardMaterial({color:0x263433,roughness:.92}),metal=new T.MeshStandardMaterial({color:0x899b98,metalness:.75,roughness:.36});
 function box(name,w,h,d,mat,x,y,z){const mesh=new T.Mesh(roundedBoxGeometry(w,h,d),mat);mesh.name=name;mesh.position.set(x,y,z);bag.add(mesh);return mesh;}
 function curve(points){return new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));}
 function cord(name,points,radius,mat){const c=curve(points),mesh=new T.Mesh(new T.TubeGeometry(c,32,radius,6,false),mat);mesh.name=name;bag.add(mesh);return c;}
 function ribbon(name,points,width){const c=curve(points),positions=[],uv=[],indices=[];for(let i=0;i<=24;i++){const p=c.getPoint(i/24);for(const side of [-1,1]){positions.push(p.x+side*width/2,p.y,p.z);uv.push(side<0?0:1,i/24);}}for(let i=0;i<24;i++){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();const mesh=new T.Mesh(geometry,webbing);mesh.name=name;bag.add(mesh);return mesh;}
 box('Soft structured fabric backpack',.46,.58,.27,cloth,0,0,0);
 box('Reinforced backpack base',.465,.075,.275,rubber,0,-.253,0);
 box('Front zipped pocket',.34,.225,.075,pocketMat,0,-.096,.16);
 for(const side of [-1,1]){box('Side fabric pocket',.055,.21,.19,cloth,side*.235,-.11,.015);cord('Pocket elastic rim',[[side*.245,-.002,-.06],[side*.257,.01,.015],[side*.245,-.002,.09]],.004,rubber);}
 const mainZip=[[-.21,.03,.14],[-.205,.19,.136],[-.14,.267,.13],[0,.282,.13],[.14,.267,.13],[.205,.19,.136],[.21,.03,.14]];
 const track=cord('Main curved zipper track',mainZip,.0055,rubber);
 const frontZip=cord('Front pocket zipper',[[-.15,.004,.201],[0,.017,.204],[.15,.004,.201]],.0045,rubber);
 for(const [c,count]of [[track,60],[frontZip,30]]){const data=[];for(let i=0;i<count;i++){const p=c.getPoint((i+.5)/count);data.push(p.x-.002,p.y,p.z+.003,p.x+.002,p.y,p.z+.003);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(data,3));const teeth=new T.LineSegments(geo,new T.LineBasicMaterial({color:0x98a4a0}));teeth.name='Individual zipper teeth';bag.add(teeth);}
 for(const [x,y,z]of [[.145,.254,.145],[-.141,.003,.214]]){const tab=box('Metal zipper pull',.018,.04,.006,metal,x,y-.018,z);tab.rotation.z=.18;box('Zipper pull opening',.007,.018,.007,rubber,x,y-.02,z+.004);}
 const piping=[[-.205,-.235,.14],[-.21,.16,.14],[-.16,.245,.14],[0,.27,.14],[.16,.245,.14],[.21,.16,.14],[.205,-.235,.14],[0,-.255,.14],[-.205,-.235,.14]];
 const seam=cord('Stitched fabric edge',piping,.003,webbing),stitches=[];
 for(let i=0;i<115;i++){const a=seam.getPoint(i/115),b=seam.getPoint((i+.45)/115);stitches.push(a.x,a.y,a.z+.003,b.x,b.y,b.z+.003);}
 const stitchGeo=new T.BufferGeometry();stitchGeo.setAttribute('position',new T.Float32BufferAttribute(stitches,3));bag.add(new T.LineSegments(stitchGeo,new T.LineBasicMaterial({color:0x93a59b,transparent:true,opacity:.65})));
 for(const side of [-1,1]){
  ribbon('Padded shoulder strap',[[side*.115,.245,-.135],[side*.135,.19,-.23],[side*.145,-.02,-.27],[side*.13,-.21,-.22],[side*.15,-.25,-.13]],.062);
  box('Strap adjustment buckle',.074,.038,.018,metal,side*.14,-.19,-.225);
  ribbon('Loose adjustment webbing',[[side*.145,-.21,-.23],[side*.15,-.29,-.22],[side*.17,-.33,-.18]],.025);
  box('Padded back panel',.145,.405,.026,webbing,side*.095,-.02,-.145);
 }
 ribbon('Carry handle',[[0,.265,-.07],[0,.355,-.085],[0,.382,-.02],[0,.35,.045],[0,.27,.055]],.035);
 box('Small stitched work badge',.105,.043,.006,webbing,0,-.105,.202);
 return bag;
}
