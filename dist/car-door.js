import * as T from './vendor/three.module.js';
import {roundedBoxGeometry} from './car-surfaces.js';
export function buildDriverDoor({paint,trim,chrome,top=1.6}){
 const door=new T.Group();door.name='Connected driver door with framed glass';door.position.set(-1,0,-.8);
 const profile=new T.Shape();profile.moveTo(.02,.65);profile.quadraticCurveTo(.08,.56,.22,.56);profile.lineTo(.94,.56);profile.quadraticCurveTo(1.16,.58,1.16,.72);profile.lineTo(1.16,1.09);profile.quadraticCurveTo(1.16,1.13,1.09,1.13);profile.lineTo(.08,1.13);profile.quadraticCurveTo(0,1.12,.02,.98);profile.lineTo(.02,.65);
 const geometry=new T.ExtrudeGeometry(profile,{depth:.045,steps:1,bevelEnabled:true,bevelSize:.012,bevelThickness:.012,bevelSegments:3,curveSegments:10});geometry.translate(0,0,-.0225);geometry.rotateY(-Math.PI/2);
 const panel=new T.Mesh(geometry,paint);panel.name='Continuous curved door skin';door.add(panel);
 const liner=new T.Mesh(geometry.clone(),trim);liner.position.x=.04;liner.name='Fitted inner door lining';door.add(liner);
 const cap=new T.Mesh(roundedBoxGeometry(.18,.085,1.12),paint);cap.position.set(.055,1.095,.58);door.add(cap);
 function roundedFrame(points){const path=new T.CurvePath(),corners=points.map((v,i)=>{const prev=points[(i+points.length-1)%points.length],next=points[(i+1)%points.length];return{v,a:v.clone().lerp(prev,Math.min(.12,.045/v.distanceTo(prev))),b:v.clone().lerp(next,Math.min(.12,.045/v.distanceTo(next)))};});for(let i=0;i<corners.length;i++){const c=corners[i],previous=corners[(i+corners.length-1)%corners.length];path.add(new T.LineCurve3(previous.b,c.a));path.add(new T.QuadraticBezierCurve3(c.a,c.v,c.b));}return path;}
 const points=[new T.Vector3(.12,1.12,.015),new T.Vector3(.28,top-.02,.33),new T.Vector3(.28,top-.02,1.15),new T.Vector3(.12,1.12,1.15)];const path=roundedFrame(points),frame=new T.Mesh(new T.TubeGeometry(path,48,.022,8,true),paint);frame.name='Continuous door window frame';door.add(frame);
 const glassPoints=[new T.Vector3(.122,1.15,.07),new T.Vector3(.272,top-.055,.355),new T.Vector3(.272,top-.055,1.1),new T.Vector3(.122,1.15,1.1)];const glassGeo=new T.BufferGeometry();glassGeo.setAttribute('position',new T.Float32BufferAttribute(glassPoints.flatMap(v=>v.toArray()),3));glassGeo.setIndex([0,1,2,0,2,3]);glassGeo.computeVertexNormals();const glass=new T.Mesh(glassGeo,new T.MeshPhysicalMaterial({color:0xa9c4ce,transparent:true,opacity:.2,roughness:.07,metalness:.04,clearcoat:1,depthWrite:false,side:T.DoubleSide}));glass.name='Transparent glass inside driver door';door.add(glass);
 const sealPath=roundedFrame(glassPoints),seal=new T.Mesh(new T.TubeGeometry(sealPath,44,.009,6,true),trim);seal.name='Window rubber seal';door.add(seal);
 const armrest=new T.Mesh(roundedBoxGeometry(.16,.11,.66),trim);armrest.position.set(.135,.88,.62);door.add(armrest);const handle=new T.Mesh(roundedBoxGeometry(.06,.035,.18),chrome);handle.position.set(-.055,1.045,.91);handle.name='Flush rounded door handle';door.add(handle);
 door.userData.assembled=true;return door;
}
