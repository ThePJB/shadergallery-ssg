#version 300 es
precision mediump float;

in vec2 uv;

out vec4 frag_colour;

#define PI 3.1415926535897932384626433832795
#define ROOT2INV 0.70710678118654752440084436210484903928

uniform float time;
uniform vec2 dimensions;
uniform sampler2D prev;
uniform vec2 resolution;
uniform vec2 mouse;


float snoise(vec2 v);


float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}


// you could make a kaleidoscope of a song, theres no reason you couldn't

// lol mix with GoL

// is there a shift and abs way of doing this?
// maybe do with 2x period only
float triangle_mod(float t, float period) {
    float phase1 = mod(t, period);
    float phase2 = mod(t, 2.0*period);
    if (phase2 > period) {
        return period - phase1;
    } else {
        return phase1;
    }
}

float triangle_mod2(float t, float period) {
    float phase2 = mod(t, 2.0*period);
    return abs(phase2 - period);
}

float dLines(vec2 p, float t) {
    float mind = 100000.0;
    for (float i = 1.0; i < 12.0; i+=1.0) {
        vec2 p1 = vec2(snoise(vec2(t, i*132.53)), snoise(vec2(t, i*159.41)));
        vec2 p2 = vec2(snoise(vec2(t, i*21.7)), snoise(vec2(t, i*47.65)));
        mind = min(mind, sdSegment(p, p1, p2));
    }
    return mind;
}

void main() {
    // n sides can change over time for trippiness
    // yo how was super hexagon made

    float n_sides = 16.0;

    vec2 uv_screen = (2.0 * (uv - vec2(0.5, 0.5))) / resolution.yy * resolution;
    float x = uv_screen.x;
    float y = uv_screen.y;
    float r = sqrt(x*x+y*y);
    float theta = atan(y,x);
    // theta will have a + time component for sure
    // float thetat = mod(theta, 2.0*PI/n_sides);
    float thetat = triangle_mod(theta + time, 2.0*PI/n_sides);
    // so this is like saw wave but how to get triangle wave?

    vec4 final_colour = vec4(1.0, 1.0, 1.0, 1.0);
    // final_colour.x = 2.0*thetat;
    // final_colour.y = r;

    vec2 uv_k = r * vec2(sin(thetat + PI/2.0), sin(thetat));

    float d = dLines(uv_k, time * 0.1);
    final_colour.x = 1.0-d;
    final_colour.y = 1.0-d*2.0;

    // if (d < 0.05) {
    //     final_colour = vec4(0.0, 0.0, 0.0, 1.0);
    // } 
    // if (d < 0.04) {
    //     final_colour = vec4(2.0*thetat, r, 0.0, 1.0);
    // }

    frag_colour = final_colour;
}





//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+10.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}