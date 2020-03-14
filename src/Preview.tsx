import React, { useRef, useEffect, useState } from 'react';
import { computeShader } from './compute';

import { installShaders, run } from './webgl';
import { Automaton } from './types';

export function Preview({ automaton }: { automaton: Automaton }) {
  const indices = new Map(automaton.states.map((s, i) => [s.name, i] as const));
  const canvas = useRef<HTMLCanvasElement>(null);
  const mouse = { x: -1, y: -1, clicked: false };
  const [dimensions, setDimensions] = useState([
    innerWidth,
    innerHeight,
  ] as const);

  useEffect(() => {
    const listner = (e: UIEvent) => {
      setDimensions([innerWidth, innerHeight]);
    };
    addEventListener('resize', listner);
    return () => {
      removeEventListener('resize', listner);
    };
  });

  useEffect(() => {
    if (!canvas.current) return;
    const renderSrc = `precision mediump float;

    uniform vec2 RESOLUTION;
    uniform sampler2D DATA;
    
    void main() {
      float val = texture2D(DATA, (gl_FragCoord.xy / RESOLUTION.xy)).r;
      ${automaton.states
        .map(
          (s, i) => `
      ${i === 0 ? '' : 'else '}if (val == ${i}.0)
        gl_FragColor = vec4(${hexToVec(s.color)}, 1.0);`,
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
      computeShader(automaton, indices),
      dimensions[0],
      dimensions[1],
    );
    return run(gl, mouse);
  }, [automaton, dimensions]);
  return (
    <canvas
      onMouseDown={e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.clicked = true;
      }}
      onMouseUp={() => {
        mouse.clicked = false;
      }}
      width={dimensions[0]}
      height={dimensions[1]}
      ref={canvas}
    ></canvas>
  );
}

function hexToVec(hex: string) {
  return `${(parseInt(hex.substring(1, 3), 16) / 256).toFixed(3)},
          ${(parseInt(hex.substring(3, 5), 16) / 256).toFixed(3)},
          ${(parseInt(hex.substring(5), 16) / 256).toFixed(3)}`;
}
