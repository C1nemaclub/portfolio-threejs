
uniform float uSize;
uniform float uTime;
varying vec3 vColor;

attribute float aScale;
attribute vec3 aRandomness;


void main(){

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    //Rotate
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.4;
    angle += angleOffset;
    modelPosition.x = (cos(angle) * distanceToCenter) + 26.0;
    modelPosition.z = (sin(angle) * distanceToCenter)+ 10.0;

    //Randomness
    modelPosition.xyz += aRandomness.xyz;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;


    gl_Position= projectedPosition;
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);
    vColor = color;

}