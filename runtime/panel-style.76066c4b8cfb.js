/* Tiny World's own soft desktop-window treatment. */
window.GlobiquestPanelStyle={
 texture(texture,scene){texture.anisotropy=Math.min(8,scene?.renderer?.capabilities?.getMaxAnisotropy?.()||4);return texture},
 frame(c,w,h,{dots=true,header=120,radius=54,opaque=false}={}){c.save?.();c.clearRect?.(0,0,w,h);const body=c.createLinearGradient(0,0,w,h);body.addColorStop(0,opaque?'#fcfefb':'rgba(252,254,251,.82)');body.addColorStop(1,opaque?'#e9f4ed':'rgba(233,244,237,.72)');c.fillStyle=body;c.beginPath();c.roundRect(1,1,w-2,h-2,radius);c.fill();if(header){const top=c.createLinearGradient(0,0,w,header);top.addColorStop(0,'rgba(255,255,255,.32)');top.addColorStop(1,'rgba(237,250,241,.16)');c.fillStyle=top;c.beginPath();c.roundRect(2,2,w-4,Math.min(header,h-4),radius);c.fill()}c.strokeStyle='rgba(255,255,255,.98)';c.lineWidth=4;c.beginPath();c.roundRect(3,3,w-6,h-6,radius);c.stroke();c.strokeStyle='rgba(167,193,179,.45)';c.lineWidth=1;c.stroke();if(dots)this.dots(c,39,24,6);c.restore?.()},
 dots(c,x=29,y=35,r=6){['#ee9c9e','#edcd8b','#9ecbb3'].forEach((color,i)=>{c.fillStyle=color;c.beginPath();c.arc(x+i*22,y,r,0,Math.PI*2);c.fill()})}
};

if(document.fonts)document.fonts.load('500 16px Inter').then(()=>window.dispatchEvent(new Event('globiquest-font-ready'))).catch(()=>{});
