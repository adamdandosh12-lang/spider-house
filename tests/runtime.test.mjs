import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL,fileURLToPath}from'node:url';
const root=fileURLToPath(new URL('../dist',import.meta.url));
const handlers={},elements=new Map();let frame=null,calls=0;
const context=new Proxy({createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),measureText:()=>({width:20})},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>(o[k]=v,true)});
function element(id){if(!elements.has(id))elements.set(id,{id,hidden:false,style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},firstElementChild:{style:{}},getContext:()=>context,addEventListener(){},setPointerCapture(){},getBoundingClientRect:()=>({left:0,top:0,width:110,height:110})});return elements.get(id);}
globalThis.document={getElementById:element,createElement:()=>({width:0,height:0,getContext:()=>context}),body:element('body'),querySelectorAll:()=>[],addEventListener:(ev,fn)=>{handlers[ev]=fn;},exitPointerLock(){},pointerLockElement:null};
globalThis.window=globalThis;globalThis.innerWidth=1440;globalThis.innerHeight=900;globalThis.devicePixelRatio=1;globalThis.matchMedia=()=>({matches:true});globalThis.addEventListener=(ev,fn)=>{handlers[ev]=fn;};globalThis.requestAnimationFrame=fn=>{frame=fn;};globalThis.localStorage={getItem:()=>null,setItem(){}};
class FakeAudio{constructor(){this.state='running';this.currentTime=0;this.sampleRate=8000;this.destination={};}createGain(){return{gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}createOscillator(){return{type:'',frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},start(){},stop(){}};}createStereoPanner(){return{pan:{value:0},connect(){}};}createBuffer(a,n){return{getChannelData:()=>new Float32Array(n)};}createBufferSource(){return{connect(){},start(){}};}createBiquadFilter(){return{frequency:{value:0},connect(){}};}}
globalThis.AudioContext=FakeAudio;
let src=fs.readFileSync(path.join(root,'game.js'),'utf8');src=src.replace(/from '(\.\/[^']+)'/g,(_,p)=>`from '${pathToFileURL(path.resolve(root,p)).href}'`);
src=src.replace('new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:\'high-performance\'})',`({setPixelRatio(){},setSize(){},shadowMap:{},info:{render:{calls:0,triangles:0}},render(){}})`);
src+=`\nglobalThis.qa={scene,houseGeometry,colliders,route,blocked,tryPlayerMove,world,roomName,upperRooms,nearestInteraction,interact,start,menu,sight,getCamera:()=>camera,stepHouse:updateHouseArt,setScenario(opts){if(opts.player)player.set(opts.player.x,(opts.player.y??0)+1.65,opts.player.z);if(opts.spider)spider.g.position.set(opts.spider.x,opts.spider.y??0,opts.spider.z);if(opts.yaw!==undefined)spider.g.rotation.y=opts.yaw;if(opts.time!==undefined)elapsed=opts.time;brain=createBrain(patrolPoints,()=>0);aiStatus={mode:'patrol',notice:0};path=[];pathTick=0;hidden=false;soundEvents=[];keys={};},setPlayer(p){player.set(p.x,(p.y??0)+1.65,p.z);},setHidden(h){hidden=h;hideSpot=hides[0];},emitSound,getBrain:()=>brain.snapshot(),getHides:()=>hides,getAxeSpawns:()=>axeSpawns};`;
await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
let now=performance.now();const step=(seconds)=>{for(let i=0;i<Math.ceil(seconds/.05);i++){now+=50;frame(now);calls++;}};
assert.equal(gameDiagnostics().state,'menu');step(.2);
let meshCount=0,triangles=0;qa.scene.traverse(o=>{if(o.isMesh){meshCount++;triangles+=o.geometry.index?o.geometry.index.count/3:o.geometry.attributes.position.count/3;}});console.log('Scene constructed:',meshCount,'meshes;',Math.round(triangles),'triangles');
qa.start();step(.1);assert.equal(gameDiagnostics().state,'playing');
assert.equal(qa.houseGeometry.scale.x,1.4,'House geometry is widened');
for(const y of [0,4.2]){const z=y?0:6;assert.ok(!qa.blocked(16,z,.3,y),'New outer floor space is walkable');assert.ok(qa.route({x:0,y:0,z:10.5},{x:16,y,z}).length,'Widened rooms stay connected');}
assert.ok(qa.colliders.some(c=>Math.abs(c.x-18.2)<.001),'Outer wall collision matches widened geometry');
console.log('Wider house: both floors gain walkable space and wall collisions match geometry');
for(const [x,z,y=0]of qa.getAxeSpawns()){
 let reachable=false;for(let dx=-1.5;dx<=1.5;dx+=.5)for(let dz=-1.5;dz<=1.5;dz+=.5){if(qa.blocked(x+dx,z+dz,.3,y))continue;if(qa.route({x:0,z:10.5},{x:x+dx,y,z:z+dz}).length)reachable=true;}
 assert.ok(reachable,`Axe ${x},${z} must be reachable`);
}
for(let h of qa.getHides()){assert.ok(qa.route({x:0,z:10.5},{x:h.x,y:h.y??0,z:h.z+1.5}).length,'Wardrobe entrance reachable');}
qa.setScenario({player:{x:0,z:5},spider:{x:0,z:0},yaw:0,time:20});step(.4);assert.equal(qa.getBrain().mode,'patrol');console.log('Behind-spider test: no chase');
qa.setScenario({player:{x:-5,z:5},spider:{x:0,z:5},yaw:Math.PI/2,time:20});step(.4);assert.equal(qa.getBrain().mode,'patrol');console.log('Actual house wall blocks sight');
qa.setScenario({player:{x:0,z:-5},spider:{x:0,z:0},yaw:0,time:20});step(.4);assert.equal(qa.getBrain().mode,'chase');let lastSeen=qa.getBrain().lastSeen;
qa.setPlayer({x:6,z:5});step(.4);assert.deepEqual(qa.getBrain().target,lastSeen);console.log('Lost-sight test: follows last seen location');
qa.setHidden(true);step(13);assert.equal(qa.getBrain().mode,'patrol');console.log('Hiding test: search times out and patrol resumes');
qa.setScenario({player:{x:-5,z:5},spider:{x:0,z:0},yaw:0,time:20});qa.emitSound(0,-5,10);step(.1);assert.equal(qa.getBrain().mode,'investigate');assert.deepEqual(qa.getBrain().target,{x:0,y:0,z:-5});console.log('Sound investigation test passed');
// Walk the actual ramp in both directions and verify floor separation.
qa.setScenario({player:{x:0,z:-13.5},spider:{x:8,z:8},time:0});
for(let z=-13.6;z>=-25;z-=.1)assert.ok(qa.tryPlayerMove(0,z),'Stairs must allow every upward step');
assert.ok(Math.abs(gameDiagnostics().player.y-4.2)<.01);
assert.ok(qa.roomName().includes('קומה שנייה'));
for(const r of qa.upperRooms){assert.ok(qa.route({x:0,y:0,z:10.5},{x:r.x,y:4.2,z:r.z}).length,'Every upstairs room connects to downstairs');}
qa.setScenario({player:{x:0,y:4.2,z:0},spider:{x:0,y:0,z:0},yaw:0,time:20});assert.equal(qa.sight(),false,'Cannot see through the floor');step(.2);assert.notEqual(qa.getBrain().mode,'chase');
qa.setScenario({player:{x:0,y:4.2,z:-25},spider:{x:8,z:8},time:0});
for(let z=-24.9;z<=-13.5;z+=.1)assert.ok(qa.tryPlayerMove(0,z),'Stairs must allow every downward step');assert.ok(Math.abs(gameDiagnostics().player.y)<.01);
qa.setScenario({player:{x:0,y:4.2,z:-25},spider:{x:0,y:0,z:-13.2},yaw:0,time:20});
step(.4);assert.equal(qa.getBrain().mode,'chase','Spider sees a player at the stair landing');
step(5);assert.ok(gameDiagnostics().spider.y>3.6,'Spider must physically climb the stairs in a pursuit');
console.log('Spider physically follows a visible player up the stairs');
console.log('Two-floor integration: walk up/down, reach all six rooms, no vision through floors');
qa.start();let axe=gameDiagnostics().axe;let found=false;for(let dx=-1.5;dx<=1.5&&!found;dx+=.5)for(let dz=-1.5;dz<=1.5&&!found;dz+=.5){let p={x:axe.x+dx,y:axe.y,z:axe.z+dz};if(qa.blocked(p.x,p.z,.3,p.y))continue;qa.setPlayer(p);if(qa.nearestInteraction()?.type==='axe'){qa.interact();found=true;}}
assert.ok(found);assert.ok(gameDiagnostics().hasAxe);qa.setPlayer({x:0,z:12});for(let i=0;i<4;i++){qa.interact();if(i<3)step(.6);}assert.equal(gameDiagnostics().state,'won');assert.equal(gameDiagnostics().hits,4);console.log('Full objective flow: pick up axe → break four boards → escape');
qa.menu();step(.1);console.log('PASS: runtime and navigation checks;',calls,'simulation frames. Renderer/DOM replaced with local stubs: visual/GPU QA not performed.');
