import {VOICE_FILES} from './voice-manifest.js';
export function speechProfile(text,{robot=false}={}){return{kind:robot||text.startsWith('רובוט:')?'robot':'male',rate:1};}
// Locally shipped neural speech; playback shares the game's mute and audio context.
export function createNaturalSpeech({getContext,getOutput,isMuted,fetcher=globalThis.fetch}){
 const cache=new Map();let generation=0,current=null;
 async function load(url){if(!cache.has(url)){const pending=fetcher(url).then(r=>{if(!r.ok)throw Error('Voice unavailable');return r.arrayBuffer();}).then(b=>getContext().decodeAudioData(b));cache.set(url,pending);pending.catch(()=>cache.delete(url));}return cache.get(url);}
 function clearEffects(c){c?.modulator?.stop();c?.nodes?.forEach(n=>n.disconnect?.());if(c){c.modulator=null;c.nodes=[];}}
 function halt(){if(current?.source){current.source.onended=null;current.source.stop();current.source=null;}clearEffects(current);}
 function stop(){generation++;halt();current=null;}
 function play(){const c=current;if(!c||c.paused||!c.buffers||isMuted())return;const ctx=getContext(),source=ctx.createBufferSource();c.source=source;source.buffer=c.buffers[c.index];if(source.playbackRate)source.playbackRate.value=c.profile.rate;if(c.profile.kind==='robot'&&ctx.createBiquadFilter&&ctx.createOscillator){const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=3800;const metallic=ctx.createGain(),depth=ctx.createGain(),modulator=ctx.createOscillator();metallic.gain.value=.9;depth.gain.value=.1;modulator.frequency.value=28;modulator.connect(depth);depth.connect(metallic.gain);source.connect(filter);filter.connect(metallic);metallic.connect(getOutput());modulator.start();c.modulator=modulator;c.nodes=[filter,metallic,depth];}else source.connect(getOutput());c.started=ctx.currentTime;source.onended=()=>{if(current!==c||c.paused)return;c.source=null;clearEffects(c);c.offset=0;if(++c.index<c.buffers.length)play();else{current=null;c.onEnd?.();}};source.start(0,c.offset);if(!c.begun){c.begun=true;c.onStart?.();}}
 function speak(text,callbacks={}){const files=VOICE_FILES[text],ctx=getContext();if(!files||!ctx?.decodeAudioData||isMuted())return false;stop();const id=generation,c={...callbacks,buffers:null,index:0,offset:0,paused:false,source:null,begun:false,profile:speechProfile(text,callbacks)};current=c;Promise.all(files.map(load)).then(buffers=>{if(id!==generation||current!==c||isMuted())return;c.buffers=buffers;play();}).catch(()=>{if(id===generation){current=null;c.onError?.();}});return true;}
 function pause(){if(!current||current.paused)return;if(current.source)current.offset+=Math.max(0,getContext().currentTime-current.started)*current.profile.rate;current.paused=true;halt();}
 function resume(){if(!current||!current.paused)return;current.paused=false;play();}
 function preload(){if(!getContext()?.decodeAudioData)return;Object.values(VOICE_FILES).slice(0,3).flat().forEach(url=>load(url).catch(()=>{}));}
 return{speak,stop,pause,resume,preload,get speaking(){return !!current;}};
}
