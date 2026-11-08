import test from 'node:test';import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {createMorningNews,buildNewsSofa,NEWS_LINES} from '../dist/morning-news.js';
import {createPhoneThumb} from '../dist/phone-thumb.js';
test('News can be left with E and restores standing player without repeating dialogue',()=>{
 const elements={};globalThis.document={getElementById:id=>elements[id]??=( {} )};globalThis.matchMedia=()=>({matches:false});const camera=new T.PerspectiveCamera(),said=[];camera.position.set(-3.4,1.65,-3.5);let done=0,stopped=0;const news=createMorningNews({camera,say:t=>said.push(t),stopSpeech:()=>stopped++,onDone:()=>done++});news.begin();news.update(2);assert.equal(news.state,'watching');news.update(.1);assert.equal(said[0],NEWS_LINES[0]);assert.ok(camera.getWorldDirection(new T.Vector3()).z<-.9,'Seated view faces TV on negative Z');news.update(1.2);news.interact();news.update(1.3);assert.equal(news.state,'done');assert.equal(camera.position.y,1.65);assert.equal(done,1);news.update(10);assert.equal(said.length,1);assert.equal(stopped,2);
});
test('Holding thumb bends to the WhatsApp icon and retracts to edge',()=>{
 const phone=new T.Group(),thumb=createPhoneThumb(phone);thumb.pose(1);assert.ok(thumb.tip.position.distanceTo(new T.Vector3(-.058,.031,.036))<1e-6);assert.equal(thumb.g.parent,phone);thumb.pose(0);assert.ok(thumb.tip.position.x>.08,'Thumb returns beside screen');const sofa=buildNewsSofa(new T.Group());assert.equal(sofa.position.z,-3.55);
});
