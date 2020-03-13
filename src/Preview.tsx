import React, { useRef, useEffect } from 'react';

import { readFileSync } from 'fs';
import { render } from 'react-dom';

import { State, Block, Rule } from './types';

const W = 500;
const H = 500;

const SCALE = 5;

import { DEFAULT_CONFIG as CONFIG } from './defaultConfig';

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
    return installShaders(
      gl,
      renderSrc,
      //readFileSync(__dirname + '/compute.glsl', 'utf-8'),
      `
      precision mediump float;

      uniform vec2 RESOLUTION;
      uniform sampler2D DATA;
      uniform vec2 OFFSET;
      uniform float FRAME;

      // From https://thebookofshaders.com/10/
      float rand(vec2 co) {
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233)) + mod(FRAME, 144.92747)) *
                    43758.5453);
      }
      vec4 encode(int val) { return vec4(float(val), 0.0, 0.0, 1.0); }
      int at(float x, float y) {
        return int(texture2D(DATA, vec2(x, RESOLUTION.y - y) / RESOLUTION).r);
      }

      void main() {
        float x = gl_FragCoord.x;
        float y = RESOLUTION.y - gl_FragCoord.y;

        gl_FragColor = encode(at(x, y));

        // Walls
        if (y == RESOLUTION.y - 0.5 || x == RESOLUTION.x - 0.5 || x == 0.5) {
          gl_FragColor = encode(2);
          return;
        }
        // Sand source
        if (FRAME < 400.0 && y == 1.5 && rand(vec2(x, y)) > .99) {
          gl_FragColor = encode(1);
        }

        if (FRAME == 401.0 && y == 1.5 && x == 1.5) {
          gl_FragColor = encode(4);
        }

        // Intermediate walls
        // if (y == 80.5 && mod(x + 3.0, 23.0) <= 20.5) {
        //   gl_FragColor = encode(2);
        // }

        // if (y == 140.5 && mod(x + 19.0, 32.0) <= 23.5) {
        //   gl_FragColor = encode(2);
        // }

        // if (y == 210.5 && mod(x + 7.0, 62.0) <= 53.5) {
        //   gl_FragColor = encode(2);
        // }

        vec2 ul;
        ul.x = x - mod(x + OFFSET.x, 2.0) + 0.5;
        ul.y = y - mod(y + OFFSET.y, 2.0) + 0.5;

        ${CONFIG.rules.map(createRule).join('')}
      }
      `,
    );
  });
  return <canvas width={W} height={H} ref={canvas}></canvas>;
}

function createRule(r: Rule): string {
  if (r.symmetry === 'horizontal') {
    return (
      createRule({ ...r, symmetry: undefined }) +
      createRule({
        before: [
          [r.before[0][1], r.before[0][0]],
          [r.before[1][1], r.before[1][0]],
        ],
        after: r.after.map(a => ({
          ...a,
          result: [
            [a.result[0][1], a.result[0][0]],
            [a.result[1][1], a.result[1][0]],
          ],
        })),
      })
    );
  }
  return `
  if (${createBeforeCondition(r.before)}) {
      ${r.after
        .map(
          a =>
            `
            if (${
              a.probability == null
                ? 'true'
                : `rand(ul) < float(${a.probability})`
            }) {${createAfterResult(a.result)}
          return;
        }`,
        )
        .join('\n')}
  }
`;
}

function createBeforeCondition(before: Block) {
  return before
    .flatMap((row, dy) =>
      row.map((s, dx) => {
        if (s === '*') {
          return 'true';
        } else if (s.startsWith('^')) {
          return `at(ul.x + ${dx}.0, ul.y + ${dy}.0) != ${INDICES.get(
            s.substring(1),
          )}`;
        } else {
          return `at(ul.x + ${dx}.0, ul.y + ${dy}.0) == ${INDICES.get(s)}`;
        }
      }),
    )
    .join(' && ');
}

function createAfterResult(result: Block) {
  return result
    .flatMap((row, dy) =>
      row.map((s, dx) =>
        s === '*'
          ? ''
          : `
            if (x == ul.x + ${dx}.0 && y == ul.y + ${dy}.0) {
              gl_FragColor = encode(${INDICES.get(s)});
            }
            `,
      ),
    )
    .filter(term => !!term)
    .join('else');
}

function installShaders(
  gl: WebGLRenderingContext,
  renderShader: string,
  computeShader: string,
) {
  console.log(computeShader);
  let timerId = -1;
  const renderProgram = createProgram(gl, renderShader);

  // Set up renderer
  gl.useProgram(renderProgram);
  const verticesLoc = gl.getAttribLocation(renderProgram, 'position');
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(verticesLoc);
  gl.vertexAttribPointer(verticesLoc, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(gl.getUniformLocation(renderProgram, 'RESOLUTION'), W, H);

  // Set up computer
  const computeProgram = createProgram(gl, computeShader);
  let [input, inputTexture, inputIndex] = createBuffer(gl);
  let [output, outputTexture, outputIndex] = createBuffer(gl);
  gl.useProgram(computeProgram);
  gl.uniform2f(
    gl.getUniformLocation(computeProgram, 'RESOLUTION'),
    W / SCALE,
    H / SCALE,
  );

  const offsets = (function*() {
    while (true) {
      yield [0, 0];
      yield [0, 1];
      yield [1, 0];
      yield [1, 1];
    }
  })();

  let frame = 0;

  function update() {
    frame++;
    // Compute next step
    gl.useProgram(computeProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, output);
    gl.uniform1i(gl.getUniformLocation(computeProgram, 'DATA'), inputIndex);
    gl.uniform1f(gl.getUniformLocation(computeProgram, 'FRAME'), frame);
    gl.uniform2fv(
      gl.getUniformLocation(computeProgram, 'OFFSET'),
      offsets.next().value,
    );
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      outputTexture,
      0,
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // swap input and output
    [input, output] = [output, input];
    [inputTexture, outputTexture] = [outputTexture, inputTexture];
    [inputIndex, outputIndex] = [outputIndex, inputIndex];
  }

  function render() {
    gl.useProgram(renderProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.uniform1i(gl.getUniformLocation(renderProgram, 'DATA'), inputIndex);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function renderAndContinue() {
    for (let i = 0; i < 2; i++) update();
    render();
    timerId = requestAnimationFrame(renderAndContinue);
  }

  renderAndContinue();

  return () => {
    cancelAnimationFrame(timerId);
  };
}

function createProgram(gl: WebGLRenderingContext, shader: string) {
  const vertex = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(
    vertex,
    `
    precision mediump float;
    attribute vec2 position;
    void main() {
          gl_Position = vec4(position, 0.0, 1.0);
    }
    `,
  );
  gl.compileShader(vertex);
  if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(vertex)!);
  }
  const fragment = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fragment, shader);
  gl.compileShader(fragment);
  if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(fragment)!);
  }
  const program = gl.createProgram()!;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program)!);
  }
  return program;
}

let index = -2;

function createBuffer(gl: WebGLRenderingContext) {
  index += 2;
  const buffer = gl.createFramebuffer();
  gl.getExtension('OES_texture_float');
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + index);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    W / SCALE,
    H / SCALE,
    0,
    gl.RGBA,
    gl.FLOAT,
    null,
  );
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error('Framebuffer incomplete');
  }
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return [buffer, texture, index] as const;
}
