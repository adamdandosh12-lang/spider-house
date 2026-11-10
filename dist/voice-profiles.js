import {ROBOT_LINES} from './robot-room.js';

// Distinct male deliveries are baked into each clip; playback stays at original speed.
export const VOICE_CAST={
  "player": {
    "id": "player",
    "gender": "male",
    "actor": "he-IL-AvriNeural",
    "pitch": "+8Hz",
    "rate": "+10%",
    "bass": 0,
    "treble": 2
  },
  "noa": {
    "id": "noa",
    "gender": "male",
    "actor": "he-IL-AvriNeural",
    "pitch": "-7Hz",
    "rate": "+5%",
    "bass": 1,
    "treble": 2
  },
  "amir": {
    "id": "amir",
    "gender": "male",
    "actor": "he-IL-AvriNeural",
    "pitch": "+1Hz",
    "rate": "+13%",
    "bass": 0,
    "treble": 3
  },
  "maya": {
    "id": "maya",
    "gender": "male",
    "actor": "he-IL-AvriNeural",
    "pitch": "-17Hz",
    "rate": "+8%",
    "bass": 1.5,
    "treble": 2.5
  },
  "yoav": {
    "id": "yoav",
    "gender": "male",
    "actor": "he-IL-AvriNeural",
    "pitch": "-2Hz",
    "rate": "+16%",
    "bass": 0.5,
    "treble": 3
  },
  "news": {
    "id": "news",
    "gender": "male",
    "actor": "he-IL-AvriNeural",
    "pitch": "-10Hz",
    "rate": "+4%",
    "bass": 0,
    "treble": 2
  },
  "pa": {
    "id": "pa",
    "gender": "male",
    "actor": "he-IL-AvriNeural",
    "pitch": "-3Hz",
    "rate": "+14%",
    "bass": 0,
    "treble": 1
  },
  "robot": {
    "id": "robot",
    "gender": "male",
    "actor": "he-IL-AvriNeural",
    "pitch": "+16Hz",
    "rate": "+0%",
    "bass": -2.5,
    "treble": 1
  },
  "narrator": {
    "id": "narrator",
    "gender": "male",
    "actor": "he-IL-AvriNeural",
    "pitch": "-9Hz",
    "rate": "+7%",
    "bass": 1,
    "treble": 2
  }
};

export function speakerFor(text,{robot=false}={}){
 if(robot||ROBOT_LINES.includes(text)||text==='ברח! אני אעכב אותו!')return 'robot';
 const who=(text.match(/^(אני|נועה|אמיר|מאיה|יואב|מגיש החדשות|חדשות|כריזה|רובוט):/)||[])[1];
 return ({אני:'player',נועה:'noa',אמיר:'amir',מאיה:'maya',יואב:'yoav','מגיש החדשות':'news',חדשות:'news',כריזה:'pa',רובוט:'robot'})[who]||(text==='איפה אני? איפה כולם?'?'player':'narrator');
}
