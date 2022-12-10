
varying vec3 vColor;


void main()
{
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = step(0.5, strength);
    // strength = 1.0 - strength;

    // gl_FragColor = vec4(vec3(strength), 1.0);

    float strenght = distance(gl_PointCoord, vec2(0.5));
    strenght *= 1.0;
    strenght = 4.0 - strenght;

    //Mix color
    vec3 color = mix(vec3(0.0), vColor, strenght);

    gl_FragColor = vec4(color,1.0);

}