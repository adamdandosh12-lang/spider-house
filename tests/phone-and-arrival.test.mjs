import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {createPlayerPhone,PLAYER_PHONE_MODEL} from '../dist/player-phone.js';
import {clearArrivalProps} from '../dist/arrival-clearance.js';
import {addStreetHouse} from '../dist/street-models.js';

test('A resting phone has no hand; held fingers follow the case without covering its display',()=>{
 const {phone,grip}=createPlayerPhone();assert.equal(grip.g.visible,false);
 const camera=new T.PerspectiveCamera();camera.add(phone);phone.position.set(.1,-.06,-.54);phone.rotation.set(-.1,-.18,-.12);grip.hold(1);camera.updateMatrixWorld(true);
 assert.equal(grip.g.parent,phone);assert.equal(phone.userData.model,PLAYER_PHONE_MODEL);
 let occluding=0;
 grip.g.traverse(o=>{if(!o.isMesh)return;const positions=o.geometry.attributes.position;for(let i=0;i<positions.count;i++){const p=phone.worldToLocal(o.localToWorld(new T.Vector3().fromBufferAttribute(positions,i)));if(p.z>.022&&Math.abs(p.x)<.085&&Math.abs(p.y)<.155)occluding++;}});
 assert.equal(occluding,0,'No resting hand geometry lies in front of the active display');
 grip.thumb.pose(1);assert.ok(grip.thumb.tip.position.distanceTo(new T.Vector3(-.058,.031,.036))<1e-6,'Thumb reaches WhatsApp only during the tap');
 grip.thumb.pose(0);grip.hide();assert.equal(grip.g.visible,false);
});

test('Landscape recording uses the same phone and keeps the live camera view upright',()=>{
 const texture=new T.Texture(),{phone,screen,grip}=createPlayerPhone({texture,landscape:true});
 assert.equal(phone.userData.model,createPlayerPhone().phone.userData.model);assert.equal(screen.material.map,texture);assert.equal(phone.rotation.z,-Math.PI/2);
 const a=screen.geometry.attributes.position,uv=screen.geometry.attributes.uv;
 for(let i=0;i<a.count;i++){assert.ok(Math.abs(uv.getX(i)-(a.getY(i)+.155)/.31)<1e-6);assert.ok(Math.abs(uv.getY(i)-(1-(a.getX(i)+.085)/.17))<1e-6);}
 grip.hold(1);assert.equal(grip.g.parent,phone);
});

test('Lab arrival removes the obstructing house and tree while keeping distant neighbourhood homes',()=>{
 const scene=new T.Group(),blocking=addStreetHouse(scene,12,-23),safe=addStreetHouse(scene,-15,-60);
 const tree=new T.Mesh(new T.BoxGeometry(.8,4,.8));tree.name='Roadside tree';tree.position.set(4,2,-18);scene.add(tree);
 const curve=new T.CatmullRomCurve3([[0,0,0],[0,0,-8],[4,0,-18],[12,0,-23],[16,0,-27]].map(p=>new T.Vector3(...p)));
 const remaining=clearArrivalProps([blocking,safe,tree],curve);
 assert.equal(blocking.parent,null);assert.equal(tree.parent,null);assert.deepEqual(remaining,[safe]);assert.equal(safe.parent,scene);
});
