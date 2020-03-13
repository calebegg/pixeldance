import React, { useRef, useEffect } from 'react';
import { State, Rule, Config } from './types';
import { computeShader } from './compute';

const W = 500;
const H = 500;

const SCALE = 5;

const CONFIG: Config = {
  states: [
    { name: 'air', color: '0.0, 0.981, 1.0' },
    { name: 'sand', color: '1.0, 0.821, 0.122' },
    { name: 'wall', color: '0.0, 0.0, 0.0' },
    { name: 'water', color: '0.0, 0.0, 1.0' },
    { name: 'dune-buggy-right', color: '1.0, 0.0, 1.0' },
    { name: 'dune-buggy-left', color: '1.0, 0.0, 1.0' },
  ],
  rules: [
    {
      before: [
        ['sand', '*'],
        ['air', '*'],
      ],
      after: [
        {
          result: [
            ['air', '*'],
            ['sand', '*'],
          ],
        },
      ],
    },
    {
      before: [
        ['sand', 'air'],
        ['sand', 'air'],
      ],
      after: [
        {
          result: [
            ['air', 'air'],
            ['sand', 'sand'],
          ],
        },
      ],
      symmetry: 'horizontal',
    },
    {
      before: [
        ['water', '*'],
        ['air', '*'],
      ],
      after: [
        {
          result: [
            ['air', '*'],
            ['water', '*'],
          ],
        },
      ],
    },
    {
      before: [
        ['water', 'air'],
        ['water', 'air'],
      ],
      after: [
        {
          result: [
            ['air', 'air'],
            ['water', 'water'],
          ],
        },
      ],
    },
    {
      before: [
        ['air', 'water'],
        ['air', 'water'],
      ],
      after: [
        {
          result: [
            ['air', 'air'],
            ['water', 'water'],
          ],
        },
      ],
    },
    {
      before: [
        ['air', 'water'],
        ['*', '^air'],
      ],
      after: [
        {
          probability: 0.75,
          result: [
            ['water', 'air'],
            ['*', '*'],
          ],
        },
      ],
      symmetry: 'horizontal',
    },
    {
      before: [
        ['dune-buggy-right', '*'],
        ['air', '*'],
      ],
      after: [
        {
          result: [
            ['air', '*'],
            ['dune-buggy-right', '*'],
          ],
        },
      ],
    },
    {
      before: [
        ['dune-buggy-right', 'air'],
        ['^air', '^air'],
      ],
      after: [
        {
          probability: 0.25,
          result: [
            ['air', 'dune-buggy-right'],
            ['*', '*'],
          ],
        },
      ],
    },
    {
      before: [
        ['dune-buggy-right', 'air'],
        ['^air', 'air'],
      ],
      after: [
        {
          probability: 0.25,
          result: [
            ['air', 'air'],
            ['*', 'dune-buggy-right'],
          ],
        },
      ],
    },
    {
      before: [
        ['air', 'air'],
        ['dune-buggy-right', '^air'],
      ],
      after: [
        {
          probability: 0.25,
          result: [
            ['air', 'dune-buggy-right'],
            ['air', '*'],
          ],
        },
      ],
    },
    {
      before: [
        ['*', '^air'],
        ['dune-buggy-right', '^air'],
      ],
      after: [
        {
          probability: 0.25,
          result: [
            ['*', '*'],
            ['dune-buggy-left', '*'],
          ],
        },
      ],
    },
    {
      before: [
        ['dune-buggy-left', '*'],
        ['air', '*'],
      ],
      after: [
        {
          result: [
            ['air', '*'],
            ['dune-buggy-left', '*'],
          ],
        },
      ],
    },
    {
      before: [
        ['air', 'dune-buggy-left'],
        ['^air', '^air'],
      ],
      after: [
        {
          probability: 0.25,
          result: [
            ['dune-buggy-left', 'air'],
            ['*', '*'],
          ],
        },
      ],
    },
    {
      before: [
        ['air', 'dune-buggy-left'],
        ['air', '^air'],
      ],
      after: [
        {
          probability: 0.25,
          result: [
            ['air', 'air'],
            ['dune-buggy-left', '*'],
          ],
        },
      ],
    },
    {
      before: [
        ['air', 'air'],
        ['^air', 'dune-buggy-left'],
      ],
      after: [
        {
          probability: 0.25,
          result: [
            ['dune-buggy-left', 'air'],
            ['*', 'air'],
          ],
        },
      ],
    },
    {
      before: [
        ['^air', '*'],
        ['^air', 'dune-buggy-left'],
      ],
      after: [
        {
          probability: 0.25,
          result: [
            ['*', '*'],
            ['*', 'dune-buggy-right'],
          ],
        },
      ],
    },
  ],
};

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
      computeShader(CONFIG, INDICES),
    );
  });
  return <canvas width={W} height={H} ref={canvas}></canvas>;
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
