export const ENGINE_FILTER_HZ=6500;
export const IGNITION_GAIN=.95;
export function engineMix(kph=0){const speed=Math.max(0,Math.min(80,Number(kph)||0));return{gain:.82+speed/500,rate:.98+speed/800};}
