AFRAME.registerComponent('spatial-controller',{init(){this.lastTurn=0;this.el.addEventListener('thumbstickmoved',e=>{const now=performance.now();if(Math.abs(e.detail.x)>.7&&now-this.lastTurn>400){document.getElementById('rig').object3D.rotation.y-=Math.sign(e.detail.x)*Math.PI/6;this.lastTurn=now}});this.el.addEventListener('gripdown',()=>window.globiquest?.holdLens(this.el));this.el.addEventListener('gripup',()=>window.globiquest?.releaseLens())}});
AFRAME.registerComponent('navigation',{init(){this.world=new AFRAME.THREE.Vector3()},tick(){if(this.el.sceneEl.is('vr-mode'))return;const camera=this.el.querySelector('a-camera');camera.object3D.getWorldPosition(this.world);const x=Math.max(-11.1,Math.min(11.1,this.world.x)),z=Math.max(-10.1,Math.min(14.1,this.world.z));this.el.object3D.position.x+=x-this.world.x;this.el.object3D.position.z+=z-this.world.z}});
AFRAME.registerComponent('lens-follow',{tick(){if(this.el.object3D.visible&&window.globiquest?.lensHeld)window.globiquest.updateLensFromAim()}});
// A lighter cartographic material preserves geography while lifting dark ocean tones.
AFRAME.registerShader('pastel-earth',{
 schema:{src:{type:'map',is:'uniform'},regionMap:{type:'map',is:'uniform'}},
 vertexShader:`uniform sampler2D regionMap; varying vec2 vUv; varying vec3 vSurface;
 void main(){vUv=uv;float region=floor(texture2D(regionMap,uv).r*255.0+0.5);float land=step(0.5,region);vec3 raised=position+normal*land*0.022;vec4 view=modelViewMatrix*vec4(raised,1.0);vSurface=view.xyz;gl_Position=projectionMatrix*view;}`,
 fragmentShader:`precision mediump float;uniform sampler2D regionMap;varying vec2 vUv;varying vec3 vSurface;
 void main(){float region=floor(texture2D(regionMap,vUv).r*255.0+0.5);vec3 color=vec3(0.96,0.945,0.91);
 if(region>0.5&&region<1.5)color=vec3(0.78431,0.70980,0.87451);
 if(region>1.5&&region<2.5)color=vec3(0.90980,0.71765,0.75686);
 if(region>2.5&&region<3.5)color=vec3(0.93725,0.77647,0.61569);
 if(region>3.5&&region<4.5)color=vec3(0.69804,0.84706,0.75686);
 if(region>4.5&&region<5.5)color=vec3(0.91373,0.85098,0.58431);
 if(region>5.5&&region<6.5)color=vec3(0.89412,0.72157,0.63137);
 if(region>6.5&&region<7.5)color=vec3(0.72,0.74,0.73);
 vec3 n=normalize(cross(dFdx(vSurface),dFdy(vSurface)));float light=0.80+0.20*max(dot(n,normalize(vec3(-0.45,0.65,1.0))),0.0);gl_FragColor=vec4(color*light,1.0);}`
});
AFRAME.registerComponent('region-mask-filter',{init(){this.apply=()=>{const material=this.el.getObject3D('mesh')?.material,texture=material?.uniforms?.regionMap?.value;if(texture){texture.colorSpace=AFRAME.THREE.NoColorSpace;texture.minFilter=texture.magFilter=AFRAME.THREE.NearestFilter;texture.generateMipmaps=false;texture.needsUpdate=true}};this.el.addEventListener('materialtextureloaded',this.apply);this.el.addEventListener('loaded',this.apply)},tick(){if(!this.ready&&this.el.getObject3D('mesh')?.material?.uniforms?.regionMap?.value?.image){this.apply();this.ready=true}},remove(){this.el.removeEventListener('materialtextureloaded',this.apply);this.el.removeEventListener('loaded',this.apply)}});
AFRAME.registerComponent('panorama-follow',{init(){this.position=new AFRAME.THREE.Vector3()},tick(){const camera=document.getElementById('camera');if(camera){camera.object3D.getWorldPosition(this.position);this.el.object3D.position.copy(this.position)}}});
AFRAME.registerComponent('sharp-panorama',{
 init(){this.apply=this.apply.bind(this);this.el.addEventListener('materialtextureloaded',this.apply);this.el.addEventListener('loaded',this.apply)},
 apply(){const mesh=this.el.getObject3D('mesh'),renderer=this.el.sceneEl.renderer,texture=mesh?.material?.map;if(!texture||!renderer)return;texture.minFilter=AFRAME.THREE.LinearFilter;texture.magFilter=AFRAME.THREE.LinearFilter;texture.generateMipmaps=false;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());texture.needsUpdate=true},
 remove(){this.el.removeEventListener('materialtextureloaded',this.apply);this.el.removeEventListener('loaded',this.apply)}
});
