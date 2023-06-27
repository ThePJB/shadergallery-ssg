Static site generator for each fragment shader in shaders

`cargo run` to generate
`http-server site` to run locally


## Shader ideas
* better water
    could go physically based and project to 2d: https://en.wikipedia.org/wiki/Trochoidal_wave
    basically sum of moving gerstner waves or phillips distribution
    https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models
    for 2d specular and fresnel
        toward sun: spcular
        above: fresnel transmission, deep colour
        from side: more reflective, sky colour
    so what we need is basically an analytic form of either heightmap or normal. mostly the normal
    maybe a wind direction
    get direction of 2 scrolling components

* for gridflow can I unnormalize it?

* grid interp flow field
* generator: circles that pop up
* colours treated differently
* mandelbulb
* raymarch menger but modify it. there was a good resource on fractal raymarching
* a fractal one like in that video -- https://www.youtube.com/watch?v=f4s1h2YETNY
* bring in the mic!!
* generating function is 3d shapes moving through the view plane. so random circles its cyliners, annulus its growing cone, i like that one actually
* zoom out, clamp to edge
* zoom in, add detail
* circling the drain
* kaleidoscopic (probs no feedback)
    to r-theta and then mod on theta. but also want alternating slices so it stitches up nicely
    and this other one has +r for random rotation
