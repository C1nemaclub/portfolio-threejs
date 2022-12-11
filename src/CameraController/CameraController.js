import gsap from 'gsap';

export default function cameraToPosition(
  camera,
  position,
  rotation,
  callback,
  target,
  backBtn,
  navLinks
) {
  gsap.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: 1.75,
    ease: 'slow(0.7, 0.7, false)',
  });
  gsap.to(camera.rotation, {
    x: rotation.x,
    y: rotation.y,
    z: rotation.z,
    duration: 1.75,
    ease: 'slow(0.7, 0.7, false)',
    onStart: () => {
      if (target && backBtn) {
        target.classList.remove('active-section');
        backBtn.classList.remove('selected');
        backBtn.style.pointerEvents = 'none';
      }
      if (navLinks) {
        navLinks.forEach((link) => {
          link.style.pointerEvents = 'none';
        });
      }
    },
    onComplete: function () {
      if (callback) {
        if (target && backBtn) {
          target.classList.add('active-section');
          backBtn.classList.add('selected');
          backBtn.style.pointerEvents = '';
        }
        if (navLinks) {
          navLinks.forEach((link) => {
            link.style.pointerEvents = '';
          });
        }
        callback();
      }
    },
  });
}
