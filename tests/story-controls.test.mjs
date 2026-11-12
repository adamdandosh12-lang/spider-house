import test from 'node:test';import assert from 'node:assert/strict';import * as T from '../dist/vendor/three.module.js';import {createStoryControls,homeBlocked} from '../dist/story-controls.js';
test('Story joystick and keyboard move the player, look remains available during dialogue, walls stop movement',()=>{
 const camera=new T.PerspectiveCamera(),c=createStoryControls(camera);c.place(0,1.65,0,new T.Vector3(0,1.65,-1));c.update(.05,{touch:{y:-1}},true,homeBlocked);assert.ok(camera.position.z<-.1);const before=camera.position.clone();c.update(.05,{lookX:.4,keys:{KeyW:true}},false,homeBlocked);assert.equal(camera.position.distanceTo(before),0);assert.ok(Math.abs(c.yaw)>.3);
 c.place(8.4,1.65,0,new T.Vector3(8.4,1.65,-1));for(let i=0;i<30;i++)c.update(.05,{keys:{KeyD:true}},true,homeBlocked);assert.ok(camera.position.x<=8.5);
});
test('Bedroom exit, news sofa, bedside phone and front door are connected by walkable floor',()=>{
 const q=[[-2.75,4.5]],visited=new Set(q.map(p=>p.join(',')));for(let i=0;i<q.length;i++){const [x,z]=q[i];for(const [dx,dz]of [[.25,0],[-.25,0],[0,.25],[0,-.25]]){const nx=x+dx,nz=z+dz,k=nx+','+nz;if(!visited.has(k)&&!homeBlocked(nx,nz)){visited.add(k);q.push([nx,nz]);}}}
 for(const [x,z]of [[-2.75,-3.5],[-2.75,5.5],[0,7],[7,2],[1,1.5]])assert.ok(visited.has(x+','+z),'Reachable objective '+x+','+z);
});
