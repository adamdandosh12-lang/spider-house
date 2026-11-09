import test from 'node:test';import assert from 'node:assert/strict';
import {ENGINE_FILTER_HZ,IGNITION_GAIN,engineMix} from '../dist/engine-audio.js';
test('Real engine recording plays louder, rises smoothly with speed and retains headroom',()=>{
 assert.ok(engineMix(0).gain>.54);assert.ok(engineMix(80).gain>engineMix(0).gain);assert.ok(engineMix(80).gain<=1);assert.ok(IGNITION_GAIN>.8&&IGNITION_GAIN<=1);assert.ok(ENGINE_FILTER_HZ>=6000);
 assert.deepEqual(engineMix(-20),engineMix(0));assert.deepEqual(engineMix(200),engineMix(80));assert.deepEqual(engineMix(NaN),engineMix(0));
 for(let kph=0;kph<=80;kph++){const mix=engineMix(kph);assert.ok(mix.rate>=.98&&mix.rate<=1.08,'Pitch remains close to the original real engine recording');if(kph)assert.ok(mix.gain-engineMix(kph-1).gain<.003,'No sudden gain jumps');}
});
