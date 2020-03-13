import React, { useRef, useEffect } from 'react';
import { computeShader } from './compute';

const W = window.innerWidth;
const H = window.innerHeight;

import { DEFAULT_CONFIG as CONFIG } from './defaultConfig';
import { installShaders, run } from './webgl';

const INDICES = new Map(CONFIG.states.map((s, i) => [s.name, i] as const));

export function Preview() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvas.current) return;
    const renderSrc = `precision mediump float;

    uniform vec2 RESOLUTION;
    uniform sampler2D DATA;
    
    void main() {
      float val = texture2D(DATA, (gl_FragCoord.xy / RESOLUTION.xy)).r;
      ${CONFIG.states
        .map(
          (s, i) => `
      ${i === 0 ? '' : 'else '}if (val == ${i}.0)
        gl_FragColor = vec4(${s.color}, 1.0);`,
        )
        .join('')}
      else
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }`;
    const gl = canvas.current.getContext('webgl')!;

    installShaders(
      gl,
      renderSrc,
      //readFileSync(__dirname + '/compute.glsl', 'utf-8'),
      computeShader(CONFIG, INDICES),
      W,
      H,
    );

    return run(gl);
  });
  return <canvas width={W} height={H} ref={canvas}></canvas>;
}
