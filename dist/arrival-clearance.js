import * as T from './vendor/three.module.js';

// Clear only scenery that occupies the car's swept path into the lab parking lot.
export function clearArrivalProps(props,curve){
 const swept=[];
 for(let i=0;i<=100;i++){
  const u=i/100,p=curve.getPointAt(u),d=curve.getTangentAt(u),yaw=Math.atan2(-d.x,-d.z),c=Math.abs(Math.cos(yaw)),s=Math.abs(Math.sin(yaw));
  const half=new T.Vector3(c*1.3+s*2.6+.4,2,s*1.3+c*2.6+.4);
  swept.push(new T.Box3(p.clone().sub(half),p.clone().add(half)));
 }
 return props.filter(prop=>{
  if(!['Neighbourhood home','Roadside tree'].includes(prop.name))return true;
  prop.updateWorldMatrix(true,true);const bounds=new T.Box3().setFromObject(prop);
  if(!swept.some(area=>area.intersectsBox(bounds)))return true;
  prop.removeFromParent();const geometries=new Set(),materials=new Set();
  prop.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const mat of o.material?(Array.isArray(o.material)?o.material:[o.material]):[])materials.add(mat);});
  geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());return false;
 });
}
