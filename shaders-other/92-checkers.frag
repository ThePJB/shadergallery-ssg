#version 300 es
precision mediump float;

uniform float time;
uniform sampler2D prev;
uniform vec2 resolution;

in vec2 uv;

out vec4 frag_colour;

#define PI 3.1415926535897932384626433832795
#define ROOT2INV 0.70710678118654752440084436210484903928

void main() {
        // for transition diamonds shrink revealing next thing
        // if L1 dist > t - tlast kind of thing
        // the flag in crash team racing: with some kind of domain warping applied
        float theta = PI/4.0;
        float up = cos(theta) * uv.x - sin(theta) * uv.y;
        float vp = sin(theta) * uv.x + cos(theta) * uv.y;

        up = up + time * 0.02;
        vp = vp + time * 0.0015;

        up *= 5.0;
        vp *= 5.0;

        up = mod(up, 1.0);
        vp = mod(vp, 1.0);

        if (up < 0.5 ^^ vp < 0.5) {
          frag_colour = vec4(0.6, 0.1, 0.6, 1.0);
        } else {
          frag_colour = vec4(0.3, 0.1, 0.6, 1.0);
        }
}

