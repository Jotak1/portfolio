/**
 * Halftone Drift — WebGL2 ambient background for the home hero.
 * Flowing field screened through a rotated halftone grid (duotone ink → cyan).
 * Pointer bends the drift. Credit: Open Design Halftone Drift example.
 */

/**
 * @param {HTMLCanvasElement | null} canvas
 * @returns {(() => void) | null} dispose, or null if WebGL2 unavailable
 */
export function initHalftoneDrift(canvas) {
  if (!canvas) return null;

  const gl = canvas.getContext("webgl2", { antialias: true, alpha: false });
  if (!gl) {
    canvas.hidden = true;
    return null;
  }

  const VERT = `#version 300 es
void main(){
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

  // Duotone jotak1: deep ink → cyan signal (exposure-cut) → muted lift
  const FRAG = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_reduce;

mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.55;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot(0.7) * p * 1.9 + 7.0;
    a *= 0.55;
  }
  return v;
}

vec3 duo(float t){
  vec3 ink    = vec3(0.024, 0.032, 0.048);
  vec3 accent = vec3(0.10, 0.58, 0.66);
  vec3 paper  = vec3(0.22, 0.26, 0.30);
  vec3 c = mix(ink, accent, smoothstep(0.20, 0.64, t));
  return mix(c, paper, smoothstep(0.70, 1.0, t));
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float t = u_time * 0.05 * (1.0 - u_reduce);
  vec2 m = (u_mouse - 0.5) * vec2(u_res.x / u_res.y, 1.0);
  vec2 pull = (m - uv);
  float grab = 0.3 / (dot(pull, pull) + 0.3);
  grab *= (1.0 - u_reduce);

  vec2 q = vec2(
    fbm(uv * 1.3 + vec2(0.0, t)),
    fbm(uv * 1.3 + vec2(4.0, -t))
  );
  float v = fbm(uv * 1.3 + 2.4 * q + grab * pull + t);
  v = smoothstep(0.15, 0.95, v);

  float cells = u_res.y / 9.0;
  vec2 sc = rot(0.4) * (gl_FragCoord.xy / u_res.y) * cells;
  vec2 g = fract(sc) - 0.5;
  float dotr = sqrt(v) * 0.72;
  float dotm = smoothstep(dotr, dotr - 0.09, length(g));

  vec3 col = mix(duo(v) * 0.20, duo(v) * 0.85, dotm);
  col += (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.012 * (1.0 - u_reduce);
  col *= 0.55 + 0.40 * smoothstep(1.45, 0.10, length(uv));
  o = vec4(pow(max(col, 0.0), vec3(1.05)), 1.0);
}`;

  function sh(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s) || "shader compile failed");
    }
    return s;
  }

  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(pr) || "program link failed");
  }
  gl.useProgram(pr);

  const uRes = gl.getUniformLocation(pr, "u_res");
  const uTime = gl.getUniformLocation(pr, "u_time");
  const uMouse = gl.getUniformLocation(pr, "u_mouse");
  const uReduce = gl.getUniformLocation(pr, "u_reduce");

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let reduce = reduceMotion.matches ? 1 : 0;

  let mouse = [0.5, 0.5];
  let target = [0.5, 0.5];

  function onPointerMove(e) {
    target = [e.clientX / innerWidth, 1.0 - e.clientY / innerHeight];
  }

  function resize() {
    const d = Math.min(devicePixelRatio || 1, 2);
    const w = (innerWidth * d) | 0;
    const h = (innerHeight * d) | 0;
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  }

  const t0 = performance.now();
  let raf = 0;
  let running = false;

  function draw(now) {
    resize();
    const lerp = reduce ? 1 : 0.06;
    mouse[0] += (target[0] - mouse[0]) * lerp;
    mouse[1] += (target[1] - mouse[1]) * lerp;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.uniform2f(uMouse, mouse[0], mouse[1]);
    gl.uniform1f(uReduce, reduce);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function frame(now) {
    if (!running) return;
    if (reduce) {
      draw(now);
      running = false;
      raf = 0;
      return;
    }
    draw(now);
    raf = requestAnimationFrame(frame);
  }

  function startLoop() {
    if (document.hidden) return;
    if (running && raf) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function stopLoop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function onReduceChange() {
    reduce = reduceMotion.matches ? 1 : 0;
    stopLoop();
    startLoop();
  }

  function onResize() {
    resize();
    if (reduce) {
      stopLoop();
      startLoop();
    }
  }

  function onVisibility() {
    if (document.hidden) stopLoop();
    else startLoop();
  }

  addEventListener("pointermove", onPointerMove);
  reduceMotion.addEventListener("change", onReduceChange);
  addEventListener("resize", onResize);
  addEventListener("visibilitychange", onVisibility);

  resize();
  startLoop();

  return function dispose() {
    stopLoop();
    removeEventListener("pointermove", onPointerMove);
    reduceMotion.removeEventListener("change", onReduceChange);
    removeEventListener("resize", onResize);
    removeEventListener("visibilitychange", onVisibility);
  };
}
