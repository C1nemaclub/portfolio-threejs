import gsap from 'gsap';

export default function cameraToPosition(camera, position, rotation) {
  gsap.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
  });
  gsap.to(camera.rotation, {
    x: rotation.x,
    y: rotation.y,
    z: rotation.z,
  });
}
