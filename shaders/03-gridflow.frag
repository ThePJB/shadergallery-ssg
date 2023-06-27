#version 300 es

#define M_PI 3.1415926535897932384626433832795

precision mediump float;

uniform float time;
uniform sampler2D prev;
uniform vec2 resolution;

in vec2 uv;
out vec4 frag_colour;


float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}


float dLine(vec2 p, float t) {
  float x = mod(t, 1.0);
  return sdSegment(p, vec2(x, 0.0), vec2(x, 1.0));
}

// Hash function
float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

// Random unit length vector generator
vec2 hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.3183099 + vec3(0.1, 0.1, 0.1));
    p3 += dot(p3, p3.yzx + 19.19);
    return (fract(vec2((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y)) - 0.5) * 2.0;
}

// interpolates between grid points
// perlin noise is this but then sum of dot products of those vectors or something? idk
vec2 flow(vec2 p) {
  vec2 ix = vec2(1.0, 0.0);
  vec2 iy = vec2(0.0, 1.0);
  vec2 p1 = floor(p);

  vec2 frac = fract(p);

  return normalize(mix(mix(hash(p1), hash(p1 + ix), frac.x), mix(hash(p1 + iy), hash(p1 + iy + ix), frac.x), frac.y));
}

void main() {
  vec2 uv_rnd = (uv*round(resolution))/resolution;
  uv_rnd = uv;
  vec2 dx = vec2(1.0/resolution.x, 0);
  vec2 dy = vec2(0, 1.0/resolution.y);

  vec2 uv_screen = (2.0 * (uv - vec2(0.5, 0.5))) / resolution.yy * resolution;

  vec2 v = flow(uv_screen*8.0);

  if (dLine(uv, time*0.1) <= 0.004) {
    frag_colour = vec4(1.0, 1.0, 1.0, 1.0);
  } else {
    frag_colour = texture(prev, uv-v*0.001)*0.99;
  }

}