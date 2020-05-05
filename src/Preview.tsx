/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useRef, useEffect, useState } from 'react';
import { computeShader } from './compute';

import { installShaders, run, setStatefulData } from './webgl';
import { Automaton } from './types';

export function Preview({
  automaton,
  clickState,
}: {
  automaton: Automaton;
  clickState: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState([-1, -1] as [
    number,
    number,
  ]);
  const [mouseDown, setMouseDown] = useState(false);
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
      computeShader(automaton),
      dimensions[0],
      dimensions[1],
    );
    return run(gl);
  }, [automaton, dimensions]);

  useEffect(() => {
    setStatefulData(mousePosition, mouseDown, clickState);
  }, [mousePosition, mouseDown, clickState]);
  return (
    <canvas
      onMouseDown={e => {
        setMousePosition([e.clientX, e.clientY]);
        setMouseDown(true);
      }}
      onMouseUp={() => {
        setMouseDown(false);
      }}
      onMouseMove={e => {
        setMousePosition([e.clientX, e.clientY]);
      }}
      onMouseLeave={() => {
        setMouseDown(false);
      }}
      onTouchStart={e => {
        setMousePosition([e.touches[0].clientX, e.touches[0].clientY]);
        setMouseDown(true);
      }}
      onTouchEnd={() => {
        setMouseDown(false);
      }}
      onTouchCancel={() => {
        setMouseDown(false);
      }}
      onTouchMove={e => {
        setMousePosition([e.touches[0].clientX, e.touches[0].clientY]);
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
