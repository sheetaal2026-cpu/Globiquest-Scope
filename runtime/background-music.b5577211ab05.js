/* Original locally composed background recording with persistent mute and narration ducking. */
(()=>{
let muted=false;try{muted=localStorage.getItem('globiquest-background-muted')==='true'}catch{}
const audio=new Audio('assets/cafe-breeze-original.mp3');audio.loop=true;audio.preload='none';audio.volume=0;
let activated=false,pending=false,timer;const button=document.createElement('button');button.type='button';button.id='backgroundMusicToggle';
function label(){button.textContent=muted?'Unmute background music':'Mute background music';button.setAttribute('aria-pressed',String(muted))}
function blocked(){return muted||document.hidden||typeof music!=='undefined'&&music.playing||!!document.querySelector('[musical-guitar]')?.components?.['musical-guitar']?.playing||!!window.speechSynthesis?.speaking}
async function play(){if(pending||!audio.paused)return;pending=true;try{await audio.play()}catch{}finally{pending=false}}
function tick(){const target=blocked()?0:.18;audio.volume+=Math.max(-.025,Math.min(.025,target-audio.volume));if(target===0&&audio.volume<.001){audio.volume=0;audio.pause()}else if(target>0&&activated)play()}
async function unlock(){if(blocked())return;activated=true;await play();if(!timer)timer=setInterval(tick,100);tick()}
button.onclick=()=>{muted=!muted;try{localStorage.setItem('globiquest-background-muted',String(muted))}catch{}label();if(muted){audio.volume=0;audio.pause()}else unlock();window.globiquest.renderXRNav?.(document.getElementById('nav'))};label();document.getElementById('spatialDock')?.append(button);
for(const event of ['pointerdown','keydown'])document.addEventListener(event,unlock,{capture:true});scene.addEventListener('enter-vr',()=>{const session=scene.renderer?.xr?.getSession();session?.addEventListener('select',unlock);session?.addEventListener('squeeze',unlock)});document.getElementById('rig')?.addEventListener('pinchstarted',unlock,true);document.addEventListener('visibilitychange',()=>{if(document.hidden){audio.volume=0;audio.pause()}});window.addEventListener('pagehide',()=>{clearInterval(timer);audio.pause()});
window.globiquest.backgroundMusic={get muted(){return muted},toggle:()=>button.click()};
})();
