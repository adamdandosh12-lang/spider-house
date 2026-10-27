// Sample the whole swept path with the same body radius as the collision map.
export function walkableSegment(a,b,blocked,radius=.38){const d=Math.hypot(a.x-b.x,a.z-b.z),n=Math.ceil(d/.1);for(let i=1;i<=n;i++){const t=i/n;if(blocked(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t,radius))return false;}return true;}
export function smoothRoute(start,points,blocked){let result=[],anchor=start,i=0;while(i<points.length){let next=i;for(let j=i+1;j<points.length;j++){if(!walkableSegment(anchor,points[j],blocked))break;next=j;}result.push(points[next]);anchor=points[next];i=next+1;}return result;}
