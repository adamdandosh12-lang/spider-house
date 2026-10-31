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
src+=`\nglobalThis.qa={secretLibrary,basement,hauntedTV,setAxeFloor:y=>axeFloor=y,axePickup,axeGlow,hauntedDolls,surfaceClimb,lose,spider,scene,houseGeometry,colliders,route,blocked,tryPlayerMove,world,roomName,upperRooms,nearestInteraction,interact,start,menu,sight,getCamera:()=>camera,stepHouse:updateHouseArt,setScenario(opts){if(opts.player)player.set(opts.player.x,(opts.player.y??0)+1.65,opts.player.z);if(opts.spider)spider.g.position.set(opts.spider.x,opts.spider.y??0,opts.spider.z);if(opts.yaw!==undefined)spider.g.rotation.y=opts.yaw;if(opts.time!==undefined)elapsed=opts.time;brain=createBrain(patrolPoints,()=>0);aiStatus={mode:'patrol',notice:0};path=[];pathTick=0;hidden=false;soundEvents=[];keys={};},setPlayer(p){player.set(p.x,(p.y??0)+1.65,p.z);},setHidden(h){hidden=h;hideSpot=hides[0];},emitSound,getBrain:()=>brain.snapshot(),getHides:()=>hides,getAxeSpawns:()=>axeSpawns};`;
await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
let now=performance.now();const step=(seconds)=>{for(let i=0;i<Math.ceil(seconds/.05);i++){now+=50;frame(now);calls++;}};
assert.equal(gameDiagnostics().state,'menu');step(.2);
let meshCount=0,triangles=0;qa.scene.traverse(o=>{if(o.isMesh){meshCount++;triangles+=o.geometry.index?o.geometry.index.count/3:o.geometry.attributes.position.count/3;}});console.log('Scene constructed:',meshCount,'meshes;',Math.round(triangles),'triangles');
qa.start();step(.1);assert.equal(gameDiagnostics().state,'playing');
assert.equal(qa.houseGeometry.scale.x,2.1,'House geometry is widened');
for(const y of [0,4.2]){const z=y?0:8;assert.ok(!qa.blocked(24,z,.3,y),'New outer floor space is walkable');assert.ok(qa.route({x:0,y:0,z:10.5},{x:24,y,z}).length,'Widened rooms stay connected');}
assert.ok(qa.colliders.some(c=>Math.abs(c.x-27.3)<.001),'Outer wall collision matches widened geometry');
for(const h of qa.getHides()){
 qa.start();qa.setScenario({player:{x:h.x,y:h.y,z:h.z+1.5},spider:{x:0,z:10},time:0});assert.equal(qa.nearestInteraction()?.type,'hide');qa.interact();assert.equal(gameDiagnostics().hidden,true);assert.equal(element('hide-view').hidden,false);qa.interact();assert.equal(gameDiagnostics().hidden,false);assert.equal(element('hide-view').hidden,true);assert.ok(!qa.blocked(gameDiagnostics().player.x,gameDiagnostics().player.z,.3,h.y),'Exit position clear');
}
qa.start();
assert.equal(qa.hauntedDolls.dolls.length,6);assert.ok(qa.axePickup.position.y-gameDiagnostics().axe.y<.7,'Axe rests low instead of floating');qa.setPlayer({x:0,z:10});step(.1);assert.equal(qa.axeGlow.visible,false,'No distant beacon');
assert.ok(qa.scene.getObjectByName('Living room skull'));qa.hauntedTV.update(0);assert.equal(qa.hauntedTV.update(12),true);qa.hauntedTV.update(15);assert.ok(qa.hauntedTV.glow.intensity>0);qa.hauntedTV.reset();assert.equal(qa.hauntedTV.glow.intensity,0);
console.log('Wider house: both floors gain walkable space and wall collisions match geometry');
for(const [x,z,y=0]of qa.getAxeSpawns()){
 let reachable=false;for(let dx=-1.5;dx<=1.5;dx+=.5)for(let dz=-1.5;dz<=1.5;dz+=.5){if(qa.blocked(x+dx,z+dz,.3,y))continue;if(qa.route({x:0,z:10.5},{x:x+dx,y,z:z+dz}).length)reachable=true;}
 assert.ok(reachable,`Axe ${x},${z} must be reachable`);
 qa.start();qa.setAxeFloor(y);qa.axePickup.position.set(x,y+.57,z);let collected=false;for(let dx=-1;dx<=1&&!collected;dx+=.25)for(let dz=-1;dz<=1&&!collected;dz+=.25){if(qa.blocked(x+dx,z+dz,.3,y))continue;qa.setPlayer({x:x+dx,y,z:z+dz});if(qa.nearestInteraction()?.type==='axe')collected=true;}assert.ok(collected,'Hidden axe has an accessible pickup position');
}
assert.equal(qa.getHides().length,14,'Fourteen wardrobes including basement');
for(let h of qa.getHides()){assert.ok(qa.route({x:0,z:10.5},{x:h.x,y:h.y??0,z:h.z+1.5}).length,'Wardrobe entrance reachable');}
qa.setScenario({player:{x:0,z:5},spider:{x:0,z:0},yaw:0,time:20});step(.4);assert.equal(qa.getBrain().mode,'patrol');console.log('Behind-spider test: no chase');
qa.setScenario({player:{x:-8,z:5},spider:{x:0,z:5},yaw:Math.PI/2,time:20});step(.4);assert.equal(qa.getBrain().mode,'patrol');console.log('Actual house wall blocks sight');
qa.setScenario({player:{x:0,z:-5},spider:{x:0,z:0},yaw:0,time:20});step(.4);assert.equal(qa.getBrain().mode,'chase');let lastSeen=qa.getBrain().lastSeen;
qa.setPlayer({x:8,z:5});step(.4);assert.deepEqual(qa.getBrain().target,lastSeen);console.log('Lost-sight test: follows last seen location');
qa.setHidden(true);step(13);assert.equal(qa.getBrain().mode,'patrol');console.log('Hiding test: search times out and patrol resumes');
qa.setScenario({player:{x:-7,z:5},spider:{x:0,z:0},yaw:0,time:20});qa.emitSound(0,-5,10);step(.1);assert.equal(qa.getBrain().mode,'investigate');assert.deepEqual(qa.getBrain().target,{x:0,y:0,z:-5});console.log('Sound investigation test passed');
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
assert.ok(!qa.blocked(14.4,-16,.3,4.2),'Lab divider removed for one large room');assert.ok(qa.blocked(6.55*2.1,-21,.3,4.2),'Intact containment glass blocks movement');assert.ok(qa.route({x:0,y:0,z:10.5},{x:9*2.1,y:4.2,z:-17}).length,'Broken chamber front reachable');qa.setPlayer({x:14.4,y:4.2,z:-17});assert.ok(qa.roomName().includes('מעבדת העכביש'));assert.ok(qa.scene.getObjectByName('Anatomical skull specimen'));let glassVisible=false;qa.scene.traverse(o=>{if(o.isMesh&&o.material.transparent&&o.material.opacity===.2)glassVisible=true;});assert.ok(glassVisible,'Glass survives static batching');
qa.start();qa.setScenario({player:{x:-8*2.1,z:-13.5},spider:{x:0,z:10},time:0});for(let z=-13.6;z>=-25;z-=.1)assert.ok(qa.tryPlayerMove(-8*2.1,z),'Basement descent is clear');assert.ok(Math.abs(gameDiagnostics().player.y+4.2)<.01);qa.setPlayer({x:0,y:-4.2,z:-30});assert.ok(qa.roomName().includes('מרתף'));assert.ok(qa.route({x:0,y:0,z:10.5},{x:0,y:-4.2,z:-34}).length,'NPC route reaches basement');qa.setPlayer({x:-8*2.1,y:-4.2,z:-25});for(let z=-24.9;z<=-13.5;z+=.1)assert.ok(qa.tryPlayerMove(-8*2.1,z),'Basement ascent is clear');assert.ok(Math.abs(gameDiagnostics().player.y)<.01);qa.basement.update(4);assert.notEqual(qa.basement.chair.rotation.x,0);qa.basement.reset();assert.equal(qa.basement.chair.rotation.x,0);
qa.start();qa.setScenario({player:{x:-8*2.1,y:-4.2,z:-25},spider:{x:-8*2.1,y:0,z:-13.2},yaw:0,time:20});step(.4);assert.equal(qa.getBrain().mode,'chase','Spider can see down the basement stairwell');step(5);assert.ok(gameDiagnostics().spider.y< -3.6,'Spider follows physically into basement');

assert.ok(qa.route({x:0,y:0,z:10.5},{x:0,y:4.2,z:-38}).length,'Hatching room is connected');qa.setPlayer({x:0,y:4.2,z:-25.5});for(let z=-25.6;z>=-38;z-=.1)assert.ok(qa.tryPlayerMove(0,z),'Red corridor passage is clear');assert.equal(qa.roomName(),'חדר הבקיעה');assert.ok(qa.scene.getObjectByName('Giant hatched spider egg'));
console.log('Two-floor integration: walk up/down, reach all six rooms, no vision through floors');
qa.start();let axe=gameDiagnostics().axe;let found=false;for(let dx=-1.5;dx<=1.5&&!found;dx+=.5)for(let dz=-1.5;dz<=1.5&&!found;dz+=.5){let p={x:axe.x+dx,y:axe.y,z:axe.z+dz};if(qa.blocked(p.x,p.z,.3,p.y))continue;qa.setPlayer(p);if(qa.nearestInteraction()?.type==='axe'){qa.interact();found=true;}}
assert.ok(found);assert.ok(gameDiagnostics().hasAxe);qa.setPlayer({x:0,z:12});for(let i=0;i<4;i++){qa.interact();if(i<3)step(.6);}assert.equal(gameDiagnostics().state,'won');assert.equal(gameDiagnostics().hits,4);console.log('Full objective flow: pick up axe → break four boards → escape');
for(const floor of [0,4.2]){
 qa.start();qa.setScenario({player:{x:0,y:floor,z:-1},spider:{x:0,y:floor,z:0},time:20});qa.getCamera().position.set(0,floor+1.65,-1);qa.lose();step(1.5);
 assert.equal(gameDiagnostics().state,'caught');assert.ok(qa.getCamera().position.y>floor+2.5,'Player lifted on either floor');
 assert.ok(qa.spider.legs.filter(l=>l.i===0).every(l=>l.links[6].position.y>2),'Front legs hold the player');
 step(.4);assert.ok(Math.abs(qa.spider.fangs[0].pivot.rotation.z)>.4,'Fangs open before bite');step(.25);assert.equal(element('prompt').textContent,'אאוץ׳!');
 step(1);assert.equal(gameDiagnostics().state,'lost');assert.ok(element('modal-body').innerHTML.includes('נשיכה'));
 qa.start();assert.equal(element('caught-fx').style.opacity,0);assert.equal(qa.spider.fangs[0].pivot.rotation.z,0);assert.equal(qa.spider.body.position.z,0);
}
qa.lose();step(.5);qa.start();step(3.2);assert.equal(gameDiagnostics().state,'playing','Restart cancels unfinished capture');
console.log('Capture: lift, front legs, fangs, bite, loss and restart verified on both floors');
qa.start();qa.setScenario({player:{x:-18,z:10},spider:{...qa.surfaceClimb.anchor,x:qa.surfaceClimb.anchor.x-.8},time:20});step(9.5);assert.ok(gameDiagnostics().spider.y>3.5,'Spider reaches actual ceiling');assert.ok(qa.spider.surfaceFrame.rotation.z>3,'Spider hangs upside down');assert.ok(element('danger').textContent.includes('התקרה'),'Ceiling warning displayed');step(12);assert.ok(gameDiagnostics().spider.y<.1,'Spider returns to ground');qa.start();assert.equal(qa.spider.surfaceFrame.rotation.z,0);assert.equal(qa.surfaceClimb.active,false);
qa.start();qa.setHidden(true);let visitedBasement=false,returned=false,visitedUpper=false;for(let i=0;i<900;i++){step(1);const p=gameDiagnostics().spider;if(p.y< -4)visitedBasement=true;if(visitedBasement&&Math.abs(p.y)<.01)returned=true;if(returned&&p.y>4.19&&p.z> -20)visitedUpper=true;if(visitedUpper)break;}console.log('Patrol result',gameDiagnostics().spider,qa.getBrain());assert.ok(visitedBasement,'Patrol descends without player lure');assert.ok(returned,'Patrol leaves basement');assert.ok(visitedUpper,'Patrol continues upstairs');
qa.start();qa.setPlayer({x:-6.5*2.1,z:10.1});assert.equal(qa.nearestInteraction().type,'hatch');qa.interact();step(.5);assert.equal(qa.secretLibrary.hand.visible,true);step(2.6);assert.equal(gameDiagnostics().state,'playing');assert.ok(gameDiagnostics().player.y< -4);for(let z=8.7;z>=-4.3;z-=.1)assert.ok(qa.tryPlayerMove(-6.5*2.1,z),'Crawl route clear');qa.setPlayer({x:-7*2.1,y:-4.2,z:-4.1});assert.equal(qa.nearestInteraction().type,'journal');qa.interact();assert.equal(gameDiagnostics().state,'paused');assert.ok(element('modal-body').innerHTML.includes('עכביש ענק'));element('modal-action').onclick();qa.setPlayer({x:-6.5*2.1,y:-4.2,z:8.8});qa.interact();step(3.1);assert.ok(Math.abs(gameDiagnostics().player.y)<.01,'Return upstairs');
qa.menu();step(.1);console.log('PASS: runtime and navigation checks;',calls,'simulation frames. Renderer/DOM replaced with local stubs: visual/GPU QA not performed.');
