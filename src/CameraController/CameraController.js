import gsap from 'gsap';

export default function cameraToPosition(
  camera,
  position,
  rotation,
  callback,
  target
) {
  gsap.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: 1.75,
  });
  gsap.to(camera.rotation, {
    x: rotation.x,
    y: rotation.y,
    z: rotation.z,
    duration: 1.75,
    onStart: () => {
      target.classList.remove('active-section');
    },
    // onUpdate: () => {
    //   camera.updateProjectionMatrix();
    // },
    onComplete: function () {
      if (callback) {
        target.classList.add('active-section');
        callback();
      }
    },
  });
}
