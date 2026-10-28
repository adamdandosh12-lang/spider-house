// Roll once per encounter; no hidden-player tracking or teleporting.
export function createJumpscare(random=Math.random){
 let cooldown=12,away=3,encounter=false,remaining=0;
 return {update(dt,eligible){cooldown=Math.max(0,cooldown-dt);remaining=Math.max(0,remaining-dt);let triggered=false;
 if(!eligible){away+=dt;if(away>=3)encounter=false;}else{away=0;if(!encounter){encounter=true;if(cooldown===0&&random()<.55){remaining=.65;cooldown=28+random()*12;triggered=true;}}}
 return {triggered,strength:remaining>0?Math.sin(Math.PI*(1-remaining/.65)):0};}};
}
