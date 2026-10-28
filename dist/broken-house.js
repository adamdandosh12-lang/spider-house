import * as THREE from './vendor/three.module.js';
import {stairHeight} from './house-world.js';
export function addBrokenHouse(scene){const root=new THREE.Group();root.name='Stair webs and broken mirrors';scene.add(root);const silk=[];
 const line=(a,b)=>silk.push(...a,...b);
 for(const side of [-1,1])for(const z of [-15,-18,-21,-24]){const x=side*1.50,y=stairHeight(z)+.85;
 const point=(a,r)=>[x,y-Math.sin(a)*r,z+Math.cos(a)*r];
 for(let i=0;i<=8;i++)line([x,y,z],point(i/8*Math.PI/2,.74));
 for(let j=1;j<=5;j++)for(let i=0;i<8;i++)line(point(i/8*Math.PI/2,j*.12),point((i+1)/8*Math.PI/2,j*.12));
 line([x,y,z],[x,stairHeight(z)+.06,z+.15]);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(silk,3));const webs=new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:0xb6c2bf,transparent:true,opacity:.5}));webs.name='Stair railing webs';root.add(webs);
 const frameMat=new THREE.MeshStandardMaterial({color:0x594631,roughness:.8}),mirrorMat=new THREE.MeshStandardMaterial({color:0x9aafb6,metalness:.8,roughness:.23,side:THREE.DoubleSide}),backMat=new THREE.MeshStandardMaterial({color:0x182127,roughness:.9});
 function box(parent,w,h,d,x,y,z,mat){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);}
 function triangle(parent,points){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));g.computeVertexNormals();const m=new THREE.Mesh(g,mirrorMat);parent.add(m);return m;}
 for(const [side,floor,z]of [[-1,0,6],[1,0,-7],[-1,4.2,-7],[1,4.2,-6]]){const mirror=new THREE.Group();mirror.name='Cracked wall mirror';mirror.position.set(side*12.72,floor+1.95,z);mirror.rotation.y=-side*Math.PI/2;root.add(mirror);
 box(mirror,1.6,2,.07,0,0,0,backMat);for(const x of [-.86,.86])box(mirror,.12,2.2,.14,x,0,0,frameMat);for(const y of [-1.04,1.04])box(mirror,1.84,.12,.14,0,y,0,frameMat);
 const edges=[[-.78,-.96],[.78,-.96],[.78,0],[.78,.96],[-.78,.96],[-.78,0]];
 for(let i=0;i<6;i++){if(i===1)continue;const a=edges[i],b=edges[(i+1)%6];triangle(mirror,[[a[0]*.98,a[1]*.98,.045],[b[0]*.98,b[1]*.98,.045],[.12+(i%2)*.025,.10,.055]]);}
 // Fallen triangles lie flat beside the wall, leaving stairs and doorways clear.
 for(let i=0;i<9;i++){const x=side*(11.5+(i%3)*.34),zz=z-.7+Math.floor(i/3)*.55;const shard=triangle(root,[[x,floor+.025,zz],[x+side*.24,floor+.025,zz+.13],[x-side*.06,floor+.025,zz+.34]]);shard.name='Floor mirror fragment';}
 }
 root.userData={stairWebs:8,mirrors:4,shards:36};return root;
}
