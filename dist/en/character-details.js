import * as T from '../vendor/three.module.js';
export function addFaceDetail(parent,{skin=0xc39576,hair=0x493728,y=1.83,z=0,scale=1}={}){
 const g=new T.Group();g.name='Detailed eyes brows and face';g.position.set(0,y,z);g.scale.setScalar(scale);parent.add(g);
 const material=c=>new T.MeshStandardMaterial({color:c,roughness:.65});const skinMat=material(skin),hairMat=material(hair),white=material(0xd7d1bb),iris=material(0x53665b),black=material(0x10171b);
 function oval(m,x,y,z,sx,sy,sz){const o=new T.Mesh(new T.SphereGeometry(1,16,12),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);g.add(o);return o;}
 const lids=[];for(const side of [-1,1]){oval(skinMat,side*.067,.025,.164,.047,.036,.025);oval(white,side*.067,.025,.185,.032,.017,.013);oval(iris,side*.067,.025,.197,.013,.014,.005);oval(black,side*.067,.025,.202,.006,.009,.003);oval(white,side*.063,.030,.206,.003,.003,.001);const brow=oval(hairMat,side*.067,.065,.177,.043,.008,.008);brow.rotation.z=-side*.08;const lid=oval(skinMat,side*.067,.025,.201,.034,.018,.006);lid.visible=false;lids.push(lid);oval(skinMat,side*.10,-.052,.15,.065,.045,.035);}
 oval(skinMat,0,-.008,.183,.026,.049,.027);oval(skinMat,0,-.04,.206,.035,.022,.023);
 for(const side of [-1,1]){oval(skinMat,side*.175,-.015,.015,.032,.065,.035);oval(material(0x97634e),side*.181,-.018,.04,.014,.036,.008);oval(material(0x704c3e),side*.017,-.049,.221,.008,.005,.003);}oval(skinMat,0,-.112,.13,.067,.035,.04);
 return{update(t,offset=0){const blink=(t+offset)%4.7<.13;lids.forEach(l=>l.visible=blink);},g};
}
export function addCarDriver(car,index=0){
 const g=new T.Group();g.name='Seated traffic driver';g.position.set(-.43,0,.2);g.rotation.y=Math.PI;car.g.add(g);
 const skin=[0xc39576,0x9b6b4c,0xddae8c][index%3],hair=[0x332c29,0x706558,0x47382d][index%3];
 function oval(c,x,y,z,sx,sy,sz){const o=new T.Mesh(new T.SphereGeometry(1,16,12),new T.MeshStandardMaterial({color:c,roughness:.9}));o.position.set(x,y,z);o.scale.set(sx,sy,sz);g.add(o);return o;}
 oval([0x526879,0x766652,0x40574c][index%3],0,1.05,0,.23,.28,.14);oval(skin,0,1.39,.005,.135,.18,.13);oval(hair,0,1.50,-.02,.14,.09,.13);addFaceDetail(g,{skin,hair,y:1.39,scale:.70});
 for(const side of [-1,1]){oval(0x34404b,side*.12,.72,.19,.09,.10,.29);oval(0x34404b,side*.12,.48,.4,.075,.22,.08);const arm=oval(0x526879,side*.22,1.08,.22,.065,.07,.23);arm.rotation.x=.3;oval(skin,side*.15,1.17,.5,.055,.045,.07);}
 const belt=new T.Mesh(new T.BoxGeometry(.045,.53,.018),new T.MeshStandardMaterial({color:0x242a2b}));belt.position.set(0,1.08,.14);belt.rotation.z=-.65;g.add(belt);return g;
}

export function addPedestrian(parent,index=0){
 const g=new T.Group();g.name='Pedestrian photographing the sports car';parent.add(g);const skin=[0xbc8969,0xe1b18f,0x8a5d45][index%3],coat=[0x456678,0x887057,0x5b6652][index%3];
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.8});const skinMat=mat(skin),cloth=mat(coat),pants=mat(0x28323e);
 function oval(p,m,x,y,z,a,b,c){const o=new T.Mesh(new T.SphereGeometry(1,12,10),m);o.position.set(x,y,z);o.scale.set(a,b,c);p.add(o);return o;}
 oval(g,cloth,0,1.12,0,.23,.33,.15);oval(g,skinMat,0,1.63,0,.14,.19,.135);oval(g,mat(0x302824),0,1.76,-.02,.145,.08,.13);const face=addFaceDetail(g,{skin,y:1.63,scale:.75});const legs=[];
 for(const side of [-1,1]){const leg=new T.Group();leg.position.set(side*.12,.87,0);g.add(leg);oval(leg,pants,0,-.22,0,.085,.24,.09);oval(leg,pants,0,-.6,.015,.07,.21,.07);oval(leg,mat(0x191e24),0,-.82,.08,.085,.055,.15);legs.push(leg);oval(g,cloth,side*.24,1.2,.14,.07,.20,.075);oval(g,skinMat,side*.14,1.29,.32,.06,.045,.10);}
 const phone=new T.Mesh(new T.BoxGeometry(.19,.10,.015),mat(0x171d25));phone.position.set(0,1.34,.39);g.add(phone);oval(g,mat(0x8faeb7),-.067,1.36,.404,.012,.012,.004);
 return{g,update(t,car,dt=.016){const near=Math.abs(g.position.z-car.position.z)<16;if(near){g.rotation.y=Math.atan2(car.position.x-g.position.x,car.position.z-g.position.z);legs.forEach(l=>l.rotation.x=0);}else{g.rotation.y=index%2?Math.PI:0;g.position.z+=Math.cos(g.rotation.y)*dt*.7;legs.forEach((l,i)=>l.rotation.x=Math.sin(t*4+i*Math.PI)*.28);}face.update(t,index);phone.visible=near;}};
}
