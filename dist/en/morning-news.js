import * as T from '../vendor/three.module.js';
export const NEWS_LINES=[
 "News Anchor: This morning at the research estate, scientists are preparing Experiment 08 to test spider silk.",
 "News Anchor: The team is developing strong, lightweight rescue ropes to save people trapped in dangerous places.",
 "News Anchor: Researchers say all testing will take place inside a sealed glass chamber. More updates later today."
];
export const WANT_NEWS="Adam: I want to see what's on the news.";
export function buildNewsSofa(group){
 const g=new T.Group();g.name='Sofa facing morning television';g.position.set(-5,0,-3.55);group.add(g);const fabric=new T.MeshStandardMaterial({color:0x496e6a,roughness:1}),seam=new T.MeshStandardMaterial({color:0x31534f,roughness:1}),wood=new T.MeshStandardMaterial({color:0x5e4938,roughness:.7});
 const box=(w,h,d,mat,x,y,z)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);g.add(m);return m;};
 box(3.2,.28,1.2,seam,0,.3,0);for(const x of [-1.34,1.34])for(const z of [-.43,.43])box(.09,.22,.09,wood,x,.11,z);box(3.05,.68,.23,fabric,0,.85,.49);for(const x of [-1.5,1.5])box(.22,.43,1.2,fabric,x,.65,0);
 for(const x of [-.95,0,.95]){const cushion=new T.Mesh(new T.SphereGeometry(1,24,16),fabric);cushion.scale.set(.47,.14,.52);cushion.position.set(x,.55,-.06);g.add(cushion);const pillow=new T.Mesh(new T.SphereGeometry(1,20,14),fabric);pillow.scale.set(.46,.29,.13);pillow.position.set(x,.88,.36);pillow.rotation.x=-.1;g.add(pillow);}return g;
}
export function createMorningNews({camera,say,stopSpeech,onDone}){
 let state='idle',time=0,page=-1,from,rotation;const seated=new T.Vector3(-5,1.18,-3.65),look=new T.Vector3(-5,1.62,-6.9),standing=new T.Vector3(-2.7,1.65,-3.6);
 function begin(){if(state!=='idle')return;state='approach';time=0;from=camera.position.clone();rotation=camera.quaternion.clone();stopSpeech();}
 function finish(){if(state!=='watching')return;stopSpeech();state='rising';time=0;from=camera.position.clone();rotation=camera.quaternion.clone();}
 function update(dt){if(state==='idle'||state==='done')return false;time+=dt;const task=document.getElementById('intro-task'),prompt=document.getElementById('intro-prompt');
 if(state==='approach'){const u=Math.min(1,time/2),e=u*u*(3-2*u);camera.position.copy(from).lerp(seated,e);camera.lookAt(look);const q=camera.quaternion.clone();camera.quaternion.copy(rotation).slerp(q,e);task.textContent="Walking to the sofa and sitting down";prompt.textContent='';if(u===1){state='watching';time=0;page=-1;}}
 else if(state==='watching'){camera.position.copy(seated);camera.lookAt(look);const next=Math.min(2,Math.floor(time/7));if(next!==page){page=next;say(NEWS_LINES[page]);}task.textContent="Morning News • Experiment 08 at the Research Estate";prompt.textContent=(matchMedia('(pointer:coarse)').matches?"Interact":'E')+" • Stand up";if(time>=23)finish();}
 else{const u=Math.min(1,time/1.2),e=u*u*(3-2*u);camera.position.copy(from).lerp(standing,e);camera.quaternion.copy(rotation).slerp(new T.Quaternion(),e);task.textContent="Getting up • Time to get ready for work";prompt.textContent='';if(u===1){state='done';onDone();}}
 return true;}
 return{begin,update,interact(){if(state==='watching'&&time>1)finish();},get active(){return state!=='idle'&&state!=='done';},get state(){return state;},get page(){return page;}};
}
