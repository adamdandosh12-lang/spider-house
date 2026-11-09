import {ROBOT_LINES} from './robot-room.js';

// Distinct male deliveries are baked into each clip; playback stays at original speed.
export const VOICE_CAST={
 player:{id:'player',gender:'male',actor:'he-IL-AvriNeural',pitch:'+8Hz',rate:'+1%',bass:0,treble:1},
 noa:{id:'noa',gender:'male',actor:'he-IL-AvriNeural',pitch:'-12Hz',rate:'-8%',bass:2,treble:-1},
 amir:{id:'amir',gender:'male',actor:'he-IL-AvriNeural',pitch:'+1Hz',rate:'+7%',bass:0,treble:2},
 maya:{id:'maya',gender:'male',actor:'he-IL-AvriNeural',pitch:'-22Hz',rate:'-3%',bass:2.5,treble:0},
 yoav:{id:'yoav',gender:'male',actor:'he-IL-AvriNeural',pitch:'-8Hz',rate:'+11%',bass:1,treble:2},
 news:{id:'news',gender:'male',actor:'he-IL-AvriNeural',pitch:'-28Hz',rate:'+6%',bass:3,treble:3},
 pa:{id:'pa',gender:'male',actor:'he-IL-AvriNeural',pitch:'-3Hz',rate:'+14%',bass:0,treble:1},
 robot:{id:'robot',gender:'male',actor:'he-IL-AvriNeural',pitch:'-35Hz',rate:'-9%',bass:3,treble:-2},
 narrator:{id:'narrator',gender:'male',actor:'he-IL-AvriNeural',pitch:'-16Hz',rate:'-5%',bass:1.5,treble:0}
};
export function speakerFor(text,{robot=false}={}){
 if(robot||ROBOT_LINES.includes(text)||text==='ברח! אני אעכב אותו!')return 'robot';
 const who=(text.match(/^(אני|נועה|אמיר|מאיה|יואב|מגיש החדשות|חדשות|כריזה|רובוט):/)||[])[1];
 return ({אני:'player',נועה:'noa',אמיר:'amir',מאיה:'maya',יואב:'yoav','מגיש החדשות':'news',חדשות:'news',כריזה:'pa',רובוט:'robot'})[who]||(text==='איפה אני? איפה כולם?'?'player':'narrator');
}
