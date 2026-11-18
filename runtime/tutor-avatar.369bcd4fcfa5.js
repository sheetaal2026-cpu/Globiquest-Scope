/* The same chubby headphone seal as the XR greeting, now the live tutor. */
AFRAME.registerComponent('tutor-avatar',{
 init(){const T=AFRAME.THREE;this.viewer=new T.Vector3();this.center=new T.Vector3();this.ensureModel()},
 ensureModel(){if(this.model||!window.globiquest?.createSealModel)return;const target=this.el.querySelector('#tutorAvatar');if(!target)return;this.model=window.globiquest.createSealModel(target.object3D);this.model.root.name='seal-tutor';this.model.root.scale.setScalar(2.8)},
 tick(time){this.ensureModel();if(!this.el.object3D.visible||!this.el.sceneEl.camera)return;const head=window.globiquest.xrHeadPose?.()?.position||this.el.sceneEl.camera.getWorldPosition(this.viewer);this.viewer.copy(head);this.el.object3D.getWorldPosition(this.center);this.viewer.y=this.center.y;this.el.object3D.lookAt(this.viewer);if(!this.model)return;const speaking=window.globiquest.tutorSpeech?.kind==='speaking';this.model.root.position.y=Math.sin(time*.002)*.025;this.model.paws.forEach((paw,i)=>{paw.rotation.z=(i?1:-1)*(speaking?.15+Math.sin(time*.006)*.12:.06)});this.model.tail.rotation.y=Math.sin(time*.003)*.16},
 remove(){this.model?.dispose();this.model=null}
});
