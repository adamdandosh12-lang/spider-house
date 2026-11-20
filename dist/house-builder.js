import * as T from './vendor/three.module.js';
export const BUILD_KEY='spider-house-build-v1',BUILD_LIMIT=30;
export const BUILD_TYPES={crate:{name:'ארגז',w:1,h:1,d:1},chair:{name:'כיסא',w:.7,h:1.2,d:.75},table:{name:'שולחן',w:1.8,h:.9,d:1},shelf:{name:'מדף ספרים',w:1.4,h:2.2,d:.5},wall:{name:'קיר',w:2.4,h:2.8,d:.16},lamp:{name:'מנורה',w:.55,h:1.8,d:.55}};
export const BUILD_COLORS=[0x846044,0x426c83,0x75816a,0x9c5344];
export function buildBounds(item){const t=BUILD_TYPES[item.kind],swap=item.rot%2;return{x:item.x,z:item.z,w:swap?t.d:t.w,d:swap?t.w:t.d,bottom:item.y,top:item.y+t.h,buildId:item.id};}
export function validBuildData(data){return Array.isArray(data)?data.slice(0,BUILD_LIMIT).filter(o=>o&&Object.hasOwn(BUILD_TYPES,o.kind)&&[o.x,o.y,o.z,o.rot,o.color].every(Number.isFinite)&&Math.abs(o.x)<32&&o.z> -70&&o.z<14&&[0,4.2,-4.2,-8.4].some(h=>Math.abs(h-o.y)<.01)&&Number.isInteger(o.rot)&&BUILD_COLORS.includes(o.color)).map(o=>({kind:o.kind,x:o.x,y:o.y,z:o.z,rot:((o.rot%4)+4)%4,color:o.color})):[];}
function makeProp(item,ghost=false){const root=new T.Group(),t=BUILD_TYPES[item.kind];root.name=t.name;root.userData.buildId=item.id;root.position.set(item.x,item.y,item.z);root.rotation.y=item.rot*Math.PI/2;
 const paint=new T.MeshStandardMaterial({color:item.color,roughness:.78,transparent:ghost,opacity:ghost?.45:1,depthWrite:!ghost}),metal=new T.MeshStandardMaterial({color:0x354047,roughness:.55,metalness:.4,transparent:ghost,opacity:ghost?.45:1,depthWrite:!ghost});
 const box=(w,h,d,x,y,z,m=paint)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=!ghost;root.add(o);return o;};
 if(item.kind==='crate'){box(1,.94,1,0,.5,0);for(const x of [-.43,.43])for(const z of [-.51,.51])box(.1,.98,.04,x,.5,z,metal);for(const y of [.08,.92])box(1.04,.1,1.04,0,y,0);}
 if(item.kind==='chair'){box(.66,.1,.66,0,.55,0);box(.66,.62,.09,0,.9,.32);for(const x of [-.26,.26])for(const z of [-.26,.26])box(.07,.5,.07,x,.25,z,metal);}
 if(item.kind==='table'){box(1.8,.12,1,0,.84,0);for(const x of [-.78,.78])for(const z of [-.38,.38])box(.09,.78,.09,x,.39,z,metal);box(1.6,.07,.08,0,.28,.38,metal);}
 if(item.kind==='shelf'){for(const x of [-.65,.65])box(.1,2.2,.5,x,1.1,0);box(1.4,2.2,.06,0,1.1,.22);for(const y of [.06,.72,1.42,2.14])box(1.4,.09,.5,0,y,0);for(let row=0;row<3;row++)for(let i=0;i<5;i++){const book=new T.MeshStandardMaterial({color:[0x783b35,0x365b59,0x8f784c][(row+i)%3],transparent:ghost,opacity:ghost?.45:1});box(.14,.32+(i%3)*.06,.3,-.48+i*.22,.12+row*.7+.19,0,book);}}
 if(item.kind==='wall'){box(2.4,2.8,.16,0,1.4,0);for(const y of [.1,1.1,2.7])box(2.42,.06,.2,0,y,0,metal);}
 if(item.kind==='lamp'){box(.5,.06,.5,0,.03,0,metal);box(.05,1.4,.05,0,.75,0,metal);const shade=new T.Mesh(new T.ConeGeometry(.3,.4,16,1,true),paint);shade.position.y=1.55;root.add(shade);if(!ghost){const light=new T.PointLight(0xffd5a0,5,5,1.5);light.position.set(0,1.45,0);root.add(light);}}
 root.userData.paint=paint;return root;}
function dispose(root){const geometry=new Set(),materials=new Set();root.traverse(o=>{if(o.geometry)geometry.add(o.geometry);if(o.material)materials.add(o.material);});geometry.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());root.removeFromParent();}
export function createHouseBuilder({scene,camera,canPlace=()=>true,onChange=()=>{},ui=()=>null,storage,onExit=()=>{},onFloor=()=>{}}){
 if(storage===undefined){try{storage=globalThis.localStorage;}catch{storage=null;}}
 const group=new T.Group();group.name='Player-built house decorations';scene.add(group);const guide=new T.Box3Helper(new T.Box3(),0xffc17a);guide.visible=false;scene.add(guide);const ray=new T.Raycaster();let data=[],nextId=1,editing=false,tool='crate',color=BUILD_COLORS[0],rot=0,selected=null,moving=null,ghost=null,candidate=null,history=[],timer=0;
 const light=new T.HemisphereLight(0xcce4ed,0x726044,.55);light.visible=false;scene.add(light);
 function message(text){const el=ui('build-status');if(el)el.textContent=text;}
 function save(){try{if(!storage)throw Error('Storage unavailable');storage.setItem(BUILD_KEY,JSON.stringify(data.map(({id,...rest})=>rest)));message('נשמר בדפדפן הזה');return true;}catch{message('לא הצלחנו לשמור. השינויים זמינים עד סגירת הדף.');return false;}}
 function repaint(){for(const o of [...group.children])dispose(o);for(const item of data){const o=makeProp(item);o.visible=item.id!==moving;group.add(o);}onChange(data.map(buildBounds));const count=ui('build-count');if(count)count.textContent=data.length+' / '+BUILD_LIMIT;}
 function permits(item,b,ignore){return !data.some(o=>{if(o.id===ignore)return false;const a=buildBounds(o);return a.top>b.bottom+.05&&a.bottom<b.top&&Math.abs(a.x-b.x)<(a.w+b.w)/2+.05&&Math.abs(a.z-b.z)<(a.d+b.d)/2+.05;})&&canPlace(item,b,ignore);}
 function remember(){history.push(JSON.stringify(data));if(history.length>20)history.shift();}
 function changed(){repaint();save();for(const k of [...Object.keys(BUILD_TYPES),'select'])ui('build-'+k)?.setAttribute?.('aria-pressed',String(k===tool));}
 function clearGhost(){if(ghost)dispose(ghost);ghost=null;candidate=null;}
 function cancel(){if(moving){moving=null;for(const o of group.children)o.visible=true;}clearGhost();tool='select';rot=0;message('כוון לחפץ שבנית ולחץ E כדי לבחור אותו.');}
 function selectTool(kind){cancel();selected=null;tool=kind;rot=0;message(kind==='select'?'כוון לחפץ שבנית ולחץ E כדי לבחור אותו.':'כוון לרצפה בחדר ולחץ E או על הנחה.');for(const k of [...Object.keys(BUILD_TYPES),'select'])ui('build-'+k)?.setAttribute?.('aria-pressed',String(k===kind));}
 function placeAt(kind,x,y,z,rotation=rot,tint=color,replaceId=null){const item={id:replaceId??'build-'+nextId++,kind,x,y,z,rot:rotation,color:tint};if(!Object.hasOwn(BUILD_TYPES,kind)||!validBuildData([item]).length)return false;if(!replaceId&&data.length>=BUILD_LIMIT){message('הגעת למגבלת החפצים. מחק חפץ כדי להוסיף אחר.');return false;}if(kind==='lamp'&&data.filter(o=>o.kind==='lamp'&&o.id!==replaceId).length>=4){message('אפשר להוסיף עד ארבע מנורות.');return false;}if(!permits(item,buildBounds(item),replaceId)){message('המקום חסום. בחר מקום פנוי בחדר והשאר את המעברים פתוחים.');return false;}
  remember();if(replaceId)data=data.map(o=>o.id===replaceId?item:o);else data.push(item);selected=item.id;moving=null;tool='select';changed();return true;}
 function picked(){camera.updateMatrixWorld(true);ray.setFromCamera(new T.Vector2(),camera);return ray.intersectObjects(group.children,true).find(hit=>hit.distance<6)?.object;}
 function select(){let o=picked();while(o&&!o.userData.buildId)o=o.parent;selected=o?.userData.buildId??null;message(selected?'החפץ נבחר. אפשר להזיז, לסובב, לצבוע או למחוק.':'כוון לחפץ שבנית ולחץ E כדי לבחור אותו.');}
 function primary(){if(tool==='select'){select();return;}if(candidate&&placeAt(tool,candidate.x,candidate.y,candidate.z,rot,color,moving)){clearGhost();if(moving===null){tool='select';}}}
 function rotate(){const item=data.find(o=>o.id===selected);if(tool!=='select'){rot=(rot+1)%4;return;}if(item)placeAt(item.kind,item.x,item.y,item.z,(item.rot+1)%4,item.color,item.id);else message('בחר חפץ קודם.');}
 function move(){const item=data.find(o=>o.id===selected);if(!item){message('בחר חפץ קודם.');return;}tool=item.kind;rot=item.rot;color=item.color;moving=item.id;group.children.find(o=>o.userData.buildId===moving).visible=false;message('כוון למקום החדש ולחץ על הנחה. Esc מבטל את ההזזה.');}
 function remove(){if(!selected){message('בחר חפץ קודם.');return;}remember();data=data.filter(o=>o.id!==selected);selected=moving=null;clearGhost();tool='select';changed();}
 function undo(){if(!history.length){message('אין פעולה לביטול.');return;}cancel();data=JSON.parse(history.pop());selected=null;changed();}
 function paint(tint){color=tint;const item=data.find(o=>o.id===selected);if(item&&tool==='select'){remember();item.color=color;changed();}}
 function update(dt,floor){if(!editing)return;timer+=dt;camera.updateMatrixWorld(true);guide.visible=false;const chosen=group.children.find(o=>o.userData.buildId===selected);if(chosen&&chosen.visible){guide.box.setFromObject(chosen);guide.visible=true;}
  if(tool==='select'){clearGhost();return;}const direction=camera.getWorldDirection(new T.Vector3()),distance=direction.y<-.15?Math.min(4,(floor-camera.position.y)/direction.y):3;const point=camera.position.clone().addScaledVector(direction,Math.max(1.5,distance));candidate={x:Math.round(point.x*2)/2,y:floor,z:Math.round(point.z*2)/2};
  if(!ghost||ghost.userData.kind!==tool||ghost.userData.tint!==color){clearGhost();ghost=makeProp({id:'preview',kind:tool,x:0,y:0,z:0,rot,color},true);ghost.userData.kind=tool;ghost.userData.tint=color;scene.add(ghost);candidate={x:Math.round(point.x*2)/2,y:floor,z:Math.round(point.z*2)/2};}
  ghost.position.set(candidate.x,candidate.y,candidate.z);ghost.rotation.y=rot*Math.PI/2;ghost.visible=true;const item={...candidate,kind:tool,rot,color,id:moving??'preview'};ghost.userData.paint.color.setHex(permits(item,buildBounds(item),moving)?0x79c6af:0xdc6559);
 }
 function setEditing(value){editing=value;const panel=ui('builder-ui');if(panel)panel.hidden=!value;light.visible=value;guide.visible=false;if(ghost)ghost.visible=value;}
 function end(){cancel();setEditing(false);}
 function handleKey(e){if(e.code==='Escape'&&tool!=='select'){cancel();return true;}if(e.code==='KeyE'){primary();return true;}if(e.code==='KeyR'){rotate();return true;}if(e.code==='Delete'||e.code==='Backspace'){remove();return true;}if(e.code==='KeyZ'&&(e.ctrlKey||e.metaKey)){undo();return true;}return false;}
 for(const kind of [...Object.keys(BUILD_TYPES),'select']){const el=ui('build-'+kind);if(el)el.onclick=()=>selectTool(kind);}
 for(const [id,fn]of Object.entries({'build-place':primary,'build-rotate':rotate,'build-move':move,'build-delete':remove,'build-undo':undo,'build-save':save,'build-exit':()=>{save();end();onExit();},'build-floor0':()=>{cancel();onFloor(0);},'build-floor1':()=>{cancel();onFloor(4.2);},'build-floor2':()=>{cancel();onFloor(-4.2);}})){const el=ui(id);if(el)el.onclick=fn;}
 BUILD_COLORS.forEach((c,i)=>{const el=ui('build-color'+i);if(el)el.onclick=()=>paint(c);});
 try{const saved=validBuildData(JSON.parse(storage?.getItem(BUILD_KEY)??'[]'));for(const o of saved){const item={...o,id:'build-'+nextId++};if(permits(item,buildBounds(item),null)&&!(o.kind==='lamp'&&data.filter(v=>v.kind==='lamp').length>=4))data.push(item);}}catch{}repaint();
 return{update,setEditing,end,save,primary,placeAt,selectTool,rotate,move,remove,undo,handleKey,get items(){return data.map(o=>({...o}));},get editing(){return editing;},get group(){return group;}};
}
