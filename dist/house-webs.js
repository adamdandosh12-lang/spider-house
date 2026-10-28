import * as THREE from './vendor/three.module.js';
// Original seeded silk geometry. All webs stay outside the central walking lane.
export function addHouseWebs(scene){
 const group=new THREE.Group();group.name='Silk-infested house';scene.add(group);
 let seed=739;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const strands=[],thin=[];let webCount=0;const anchors=[];
 const line=(a,b,detail=false)=>(detail?thin:strands).push(...a,...b);
 function fan(origin,u,v,size){webCount++;const spokes=11,rings=8;
 const point=(a,r)=>origin.map((n,k)=>n+u[k]*Math.cos(a)*r+v[k]*Math.sin(a)*r+(k===1?-.09*Math.sin(a*2)*r/size:0));
 const angles=Array.from({length:spokes},(_,i)=>i/(spokes-1)*Math.PI/2);
 for(const a of angles)line(origin,point(a,size*(.87+rand()*.13)));
 for(let j=1;j<=rings;j++)for(let i=0;i<spokes-1;i++){if(rand()<.1)continue;const r=size*j/(rings+1),a=point(angles[i],r),b=point(angles[i+1],r),mid=a.map((n,k)=>(n+b[k])/2+(k===1?-.025:0));line(a,mid,true);line(mid,b,true);}
 }
 for(const floor of [0,4.2]){const bands=floor?[-25.8,-15.3,-4.3]:[-13.2,-3.8,5.2];
 for(const side of [-1,1])for(const z of bands){const x=side*12.55,y=floor+3.28;
 fan([x,y,z],[-side,0,0],[0,0,1],2.5+rand()*.5);
 fan([x,y,z],[0,-1,0],[0,0,1],1.65+rand()*.45);
 fan([side*3.3,y,z],[side,0,0],[0,0,1],1.45+rand()*.3);
 // Ragged silk threads beside the outer wall, away from doors and signs.
 for(let i=0;i<7;i++){const xx=x-side*(.12+rand()*.5),zz=z+rand()*2.5,len=.3+rand()*1.25;line([xx,y,zz],[xx+.06,y-len,zz+.04],true);}
 const cocoon={x:x-side*.6,y:floor+2.2+rand()*.3,z:z+1.15};anchors.push(cocoon);line([cocoon.x,floor+3.45,cocoon.z],[cocoon.x,cocoon.y+.28,cocoon.z]);
 // Small webs over the rear edge of furniture rather than across the room.
 fan([side*11.8,floor+1.15,z+.2],[-side,0,0],[0,1,0],.65);
 }}
 function meshLines(points,color,opacity){const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));const mesh=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));group.add(mesh);}
 meshLines(strands,0xbac3bc,.48);meshLines(thin,0x929f9c,.31);
 const sacs=new THREE.InstancedMesh(new THREE.SphereGeometry(1,12,10),new THREE.MeshStandardMaterial({color:0x8d9485,roughness:1}),anchors.length);const dummy=new THREE.Object3D();
 anchors.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.scale.set(.12,.25,.12);dummy.rotation.z=(rand()-.5)*.3;dummy.updateMatrix();sacs.setMatrixAt(i,dummy.matrix);});sacs.castShadow=true;group.add(sacs);
 group.userData={webCount,cocoonCount:anchors.length,strandCount:(strands.length+thin.length)/6};return group;
}
