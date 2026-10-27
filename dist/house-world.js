export const FLOOR_HEIGHT=4.2;
export const STAIR={x:0,halfWidth:1.45,bottomZ:-14,topZ:-24};
export const upperRooms=[
 {name:'חדר שינה ראשי',x:-8,z:-21.5,row:0},
 {name:'חדר הילדים',x:8,z:-21.5,row:0},
 {name:'חדר רחצה',x:-8,z:-10.5,row:1},
 {name:'חדר עבודה',x:8,z:-10.5,row:1},
 {name:'חדר אורחים',x:-8,z:-.5,row:2},
 {name:'חדר משחקים',x:8,z:-.5,row:2}
];
export function onStairs(x,z){return Math.abs(x)<=STAIR.halfWidth&&z>=-24&&z<=-13.5;}
export function stairHeight(z){return Math.max(0,Math.min(FLOOR_HEIGHT,(-14-z)/10*FLOOR_HEIGHT));}
function upperSurface(x,z){return Math.abs(x)<=12.5&&z>=-26.5&&z<=3.5&&!(Math.abs(x)<1.6&&z> -24&&z< -14);}
export function surfacesAt(x,z){
 const out=[];
 if(onStairs(x,z))out.push(stairHeight(z));
 else{
  if(Math.abs(x)<=12.5&&z>=-13.5&&z<=13.5)out.push(0);
  if(upperSurface(x,z))out.push(FLOOR_HEIGHT);
 }
 return out;
}
export function floorAt(x,z,current=0,maxStep=.29){let best=null,d=Infinity;for(const h of surfacesAt(x,z)){const gap=Math.abs(h-current);if(gap<=maxStep&&gap<d){best=h;d=gap;}}return best;}
export function makeWorld(colliders){
 const blocked=(x,z,r=.3,y=0)=>!surfacesAt(x,z).some(h=>Math.abs(h-y)<.29)||colliders.some(c=>c.top>y+.08&&c.bottom<y+1.9&&Math.abs(x-c.x)<c.w/2+r&&Math.abs(z-c.z)<c.d/2+r);
 const nodes=[],buckets=new Map(),step=.5,minX=-12.5,minZ=-26.5,NX=51,NZ=81;
 for(let iz=0;iz<NZ;iz++)for(let ix=0;ix<NX;ix++){
  const x=minX+ix*step,z=minZ+iz*step,list=[];
  for(const y of surfacesAt(x,z))if(!blocked(x,z,.38,y)){let n={x,y,z,id:nodes.length,ix,iz,neighbors:[]};nodes.push(n);list.push(n);}
  if(list.length)buckets.set(iz*NX+ix,list);
 }
 for(const n of nodes)for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){
  const ix=n.ix+dx,iz=n.iz+dz;if(ix<0||ix>=NX||iz<0||iz>=NZ)continue;
  for(const q of buckets.get(iz*NX+ix)||[])if(Math.abs(q.y-n.y)<.29&&!blocked((n.x+q.x)/2,(n.z+q.z)/2,.38,(n.y+q.y)/2))n.neighbors.push(q.id);
 }
 function nearest(p){let found=null,best=Infinity;for(const n of nodes){let d=(n.x-p.x)**2+(n.z-p.z)**2+((n.y-(p.y??0))*4)**2;if(d<best){best=d;found=n;}}return found;}
 function route(from,to){const start=nearest(from),end=nearest(to);if(!start||!end)return[];const prev=new Int32Array(nodes.length).fill(-1),queue=[start.id];prev[start.id]=start.id;
  for(let i=0;i<queue.length;i++){let id=queue[i];if(id===end.id)break;for(const q of nodes[id].neighbors)if(prev[q]===-1){prev[q]=id;queue.push(q);}}
  if(prev[end.id]<0)return[];let out=[];for(let n=end.id;n!==start.id;n=prev[n]){const {x,y,z}=nodes[n];out.push({x,y,z});}return out.reverse();
 }
 return{blocked,route,nodes};
}
