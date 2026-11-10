import test from 'node:test';import assert from 'node:assert/strict';import {returnDrivePose} from '../dist/return-drive.js';
test('Return trip visibly turns around, then travels forwards in the direction of the bonnet',()=>{
 let prev=returnDrivePose(0),turning=false,straight=false;
 for(let t=.01;t<=7;t+=.01){const pose=returnDrivePose(t),dx=pose.x-prev.x,dz=pose.z-prev.z,speed=Math.hypot(dx,dz),yaw=(pose.yaw+prev.yaw)/2;if(speed>1e-7)assert.ok((dx*-Math.sin(yaw)+dz*-Math.cos(yaw))/speed>.999,'Movement must never be reverse or sideways');assert.ok(Math.abs(pose.x)<=2.001,'Turn stays inside road');assert.ok(pose.distance>=prev.distance);assert.ok(speed<.35,'No teleport during turn or departure');if(t<2.3&&pose.yaw<-.5)turning=true;if(t>3&&dz>0&&pose.yaw===-Math.PI)straight=true;prev=pose;}
 assert.ok(turning&&straight);assert.ok(Math.abs(returnDrivePose(2.4-.00001).z-returnDrivePose(2.4).z)<1e-5);assert.deepEqual(returnDrivePose(-1),returnDrivePose(0));assert.deepEqual(returnDrivePose(20),returnDrivePose(7));
});
