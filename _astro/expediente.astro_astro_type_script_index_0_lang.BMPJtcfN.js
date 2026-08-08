import{b as U}from"./boot.DzYBxe6Q.js";function H(){const t=window.gsap,e=window.Motion,M=window.ScrollTrigger;if(!t||!e){console.warn("[expediente] gsap/Motion missing");return}document.documentElement.classList.add("js-ready"),e.injectCurtainStyles(),e.playEnter(),e.bindInternalLinks(),e.ensureMuteButton(document.querySelector(".topnav-actions")||document.querySelector(".topnav-inner")),e.bindTopnavScroll(document.querySelector(".topnav"));const L=e.prefersReduced(),P=document.getElementById("hero-wave"),c=document.getElementById("hero-wave-harm"),B=document.getElementById("hero-wave-ghost"),C=document.getElementById("hero-wave-fill"),k=document.getElementById("scroll-progress"),F=document.getElementById("timeline-track"),f=document.getElementById("timeline-pin"),g=document.getElementById("timeline-year"),p=document.getElementById("timeline-label"),T=document.getElementById("timeline-idx"),R=document.getElementById("timeline-fill"),d=t.utils.toArray(".timeline-card"),W=["trayectoria","stack","contacto"];t.registerPlugin(M);function h(){document.querySelectorAll('a[href^="#"]').forEach(n=>{n.addEventListener("click",a=>{const o=n.getAttribute("href").slice(1),r=document.getElementById(o);if(!r)return;a.preventDefault();const s=r.getBoundingClientRect().top+window.scrollY-72;if(window.scrollTo({top:s,behavior:L?"auto":"smooth"}),typeof r.focus=="function")try{r.setAttribute("tabindex","-1"),r.focus({preventScroll:!0})}catch{}})})}function v(){const n=window.scrollY+window.innerHeight*.28;let a="";W.forEach(o=>{const r=document.getElementById(o);r&&r.offsetTop<=n&&(a=o)}),document.querySelectorAll('.topnav nav a[href^="#"]').forEach(o=>{const r=o.getAttribute("href").slice(1);r&&r===a?o.setAttribute("aria-current","true"):o.removeAttribute("aria-current")})}const y={amp:26,phase:0,breath:0},A=280,I=60,E=56;function q(n,a,o,r,s=0){const l=n/A*Math.PI*2*r+a,w=Math.sin(l)*o,x=Math.sin(l*2.15+.4)*o*s,_=Math.sin(l*5.2-a*.6)*o*.12;return I+w+x+_}function b(n,a,o,r,s){let l="";for(let w=0;w<=E;w++){const x=w/E*A,_=q(x,n,a,o,r);l+=w===0?`M${x.toFixed(1)} ${_.toFixed(2)}`:` L${x.toFixed(1)} ${_.toFixed(2)}`}return s&&(l+=` L${A} 120 L0 120 Z`),l}function S(){const n=1+Math.sin(y.breath)*.18,a=y.amp*n,o=y.phase;P&&P.setAttribute("d",b(o,a,2.75,.28,!1)),c&&c.setAttribute("d",b(o*1.15+.9,a*.55,3.6,.2,!1)),B&&B.setAttribute("d",b(o*.7-.5,a*.35,1.6,0,!1)),C&&C.setAttribute("d",b(o,a,2.75,.28,!0))}if(S(),h(),v(),window.addEventListener("scroll",v,{passive:!0}),L||(t.to(y,{phase:Math.PI*6,duration:4.5,repeat:-1,ease:"none",onUpdate:S}),t.to(y,{amp:34,breath:Math.PI*2,duration:2.4,repeat:-1,yoyo:!0,ease:"sine.inOut",onUpdate:S})),L){t.set(".reveal, .split-char, .split-word",{clearProps:"all",opacity:1,y:0});return}const i=e.splitChars(document.getElementById("title-l1")),m=e.splitWords(document.getElementById("title-l2")),u=i.concat(m);t.set(u,{yPercent:120,opacity:0}),t.set(".reveal",{opacity:0,y:36}),t.set(".hero .eyebrow",{opacity:0,y:12}),t.set(".hero .lead",{opacity:0,y:16}),t.set(".hero .hero-cta",{opacity:0,y:16}),t.set(".signal-card",{opacity:0,y:40,scale:.96}),t.timeline({defaults:{ease:"power3.out"}}).to(".hero .eyebrow",{opacity:1,y:0,duration:.55},.1).to(u,{yPercent:0,opacity:1,duration:.7,stagger:.016,ease:"power4.out"},.18).to(".hero .lead",{opacity:1,y:0,duration:.7},.5).to(".hero .hero-cta",{opacity:1,y:0,duration:.6},.65).to(".signal-card",{opacity:1,y:0,scale:1,duration:.9},.35),t.to(".signal-card",{y:-48,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:!0}}),t.matchMedia().add("(min-width: 721px)",()=>{const n=()=>Math.max(0,F.scrollWidth-f.clientWidth+80);t.timeline({scrollTrigger:{trigger:f,start:"top top",end:()=>"+="+n(),pin:!0,scrub:.65,anticipatePin:1,invalidateOnRefresh:!0,onUpdate:r=>{const s=Math.min(d.length-1,Math.round(r.progress*(d.length-1))),l=d[s];g.textContent=l.dataset.year,p.textContent=l.dataset.label,T.textContent=String(s+1).padStart(2,"0"),t.set(R,{width:r.progress*100+"%"})}}}).to(F,{x:()=>-n(),ease:"none"}),d.forEach((r,s)=>{M.create({trigger:f,start:"top top",end:()=>"+="+n(),scrub:!0,onUpdate:l=>{const w=s/(d.length-1),x=Math.abs(l.progress-w),_=Math.max(0,1-x*2.2);t.set(r,{opacity:.4+_*.6,scale:.94+_*.06})}})});let o=0;M.create({trigger:f,start:"top top",end:()=>"+="+n(),onUpdate:r=>{const s=Math.min(d.length-1,Math.round(r.progress*(d.length-1)));s!==o&&(o=s,t.fromTo(g,{y:24,opacity:.35},{y:0,opacity:1,duration:.35,ease:"power3.out"}))}})}),t.utils.toArray(".reveal").forEach(n=>{t.to(n,{opacity:1,y:0,duration:.85,ease:"power3.out",scrollTrigger:{trigger:n,start:"top 85%",toggleActions:"play none none none"}})}),t.utils.toArray('[data-od-id^="stack-"] .tag').forEach(n=>{t.from(n,{opacity:0,y:10,duration:.4,ease:"power2.out",scrollTrigger:{trigger:n.closest(".card"),start:"top 80%"},stagger:.04})}),t.to(k,{width:"100%",ease:"none",scrollTrigger:{trigger:document.body,start:"top top",end:"bottom bottom",scrub:.3}})}function V(t){if(!t)return null;const e=t.getContext("webgl2",{antialias:!0,alpha:!1});if(!e)return t.hidden=!0,null;const M=`#version 300 es
void main(){
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,L=`#version 300 es
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
}`;function P(i,m){const u=e.createShader(i);if(e.shaderSource(u,m),e.compileShader(u),!e.getShaderParameter(u,e.COMPILE_STATUS))throw new Error(e.getShaderInfoLog(u)||"shader compile failed");return u}const c=e.createProgram();if(e.attachShader(c,P(e.VERTEX_SHADER,M)),e.attachShader(c,P(e.FRAGMENT_SHADER,L)),e.linkProgram(c),!e.getProgramParameter(c,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(c)||"program link failed");e.useProgram(c);const B=e.getUniformLocation(c,"u_res"),C=e.getUniformLocation(c,"u_time"),k=e.getUniformLocation(c,"u_mouse"),F=e.getUniformLocation(c,"u_reduce"),f=matchMedia("(prefers-reduced-motion: reduce)");let g=f.matches?1:0,p=[.5,.5],T=[.5,.5];function R(i){T=[i.clientX/innerWidth,1-i.clientY/innerHeight]}function d(){const i=Math.min(devicePixelRatio||1,2),m=innerWidth*i|0,u=innerHeight*i|0;m===t.width&&u===t.height||(t.width=m,t.height=u,e.viewport(0,0,m,u))}const W=performance.now();let h=0,v=!1;function y(i){d();const m=g?1:.06;p[0]+=(T[0]-p[0])*m,p[1]+=(T[1]-p[1])*m,e.uniform2f(B,t.width,t.height),e.uniform1f(C,(i-W)/1e3),e.uniform2f(k,p[0],p[1]),e.uniform1f(F,g),e.drawArrays(e.TRIANGLES,0,3)}function A(i){if(v){if(g){y(i),v=!1,h=0;return}y(i),h=requestAnimationFrame(A)}}function I(){document.hidden||v&&h||(v=!0,h=requestAnimationFrame(A))}function E(){v=!1,h&&cancelAnimationFrame(h),h=0}function q(){g=f.matches?1:0,E(),I()}function b(){d(),g&&(E(),I())}function S(){document.hidden?E():I()}return addEventListener("pointermove",R),f.addEventListener("change",q),addEventListener("resize",b),addEventListener("visibilitychange",S),d(),I(),function(){E(),removeEventListener("pointermove",R),f.removeEventListener("change",q),removeEventListener("resize",b),removeEventListener("visibilitychange",S)}}U({scrollTrigger:!0}).then(()=>{H();const t=document.getElementById("halftone-canvas"),e=()=>V(t);"requestIdleCallback"in window?requestIdleCallback(e,{timeout:2e3}):requestAnimationFrame(()=>requestAnimationFrame(e))});
