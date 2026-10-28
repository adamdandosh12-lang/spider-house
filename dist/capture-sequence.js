const ease=(t,a,b)=>{const u=Math.max(0,Math.min(1,(t-a)/(b-a)));return u*u*(3-2*u);};
export function capturePose(t){return {grab:ease(t,0,.35),lift:ease(t,.3,1.4),open:ease(t,1.35,1.8)*(1-ease(t,1.95,2.12)),bite:ease(t,1.85,2.04)*(1-ease(t,2.1,2.4)),fade:ease(t,2.12,2.65),done:t>=3};}
