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

const SCALE = 10;

const offsets = (function*() {
  while (true) {
    yield [0, 0];
    yield [0, 1];
    yield [1, 0];
    yield [1, 1];
  }
})();

let computeProgram: WebGLProgram;
let renderProgram: WebGLProgram;

let input: BufferData;
let output: BufferData;

let mousePosition = [-1, -1];
let mouseDown = false;
let clickState = 0;

export function setStatefulData(mP: [number, number], mD: boolean, cS: number) {
  mousePosition = mP;
  mouseDown = mD;
  clickState = cS;
}

/** Start the animation, updating the cell states and rendering every frame. */
export function run(gl: WebGLRenderingContext) {
  let timerId = -1;
  let frame = 0;

  function renderAndContinue() {
    frame++;
    if (frame % 2 == 0) update(gl, frame / 2);
    else render(gl);
    timerId = requestAnimationFrame(renderAndContinue);
  }

  renderAndContinue();

  return () => {
    cancelAnimationFrame(timerId);
  };
}

/** Run the compute shader to update the state of each cell. */
function update(gl: WebGLRenderingContext, frame: number) {
  // Compute next step
  gl.useProgram(computeProgram);
  gl.bindFramebuffer(gl.FRAMEBUFFER, output.buffer);
  gl.uniform1i(gl.getUniformLocation(computeProgram, 'DATA'), input.index);
  gl.uniform1f(gl.getUniformLocation(computeProgram, 'FRAME'), frame);
  gl.uniform2fv(
    gl.getUniformLocation(computeProgram, 'OFFSET'),
    offsets.next().value,
  );
  gl.uniform2fv(
    gl.getUniformLocation(computeProgram, 'CLICK'),
    mouseDown
      ? [
          Math.floor(mousePosition[0] / SCALE),
          Math.floor(mousePosition[1] / SCALE),
        ]
      : [-1, -1],
  );
  gl.uniform1i(
    gl.getUniformLocation(computeProgram, 'CLICK_STATE'),
    clickState,
  );
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    output.texture,
    0,
  );
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // swap input and output
  [input, output] = [output, input];
}

/** Run the render shader to render the cells to the canvas */
function render(gl: WebGLRenderingContext) {
  gl.useProgram(renderProgram);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.uniform1i(gl.getUniformLocation(renderProgram, 'DATA'), input.index);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

export function installShaders(
  gl: WebGLRenderingContext,
  renderShader: string,
  computeShader: string,
  width: number,
  height: number,
) {
  renderProgram = createProgram(gl, renderShader);
  computeProgram = createProgram(gl, computeShader);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

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
  gl.uniform2f(
    gl.getUniformLocation(renderProgram, 'RESOLUTION'),
    width,
    height,
  );

  // Set up computer
  input = createBuffer(gl, width, height, 0);
  output = createBuffer(gl, width, height, 2);
  gl.useProgram(computeProgram);
  gl.uniform2f(
    gl.getUniformLocation(computeProgram, 'RESOLUTION'),
    Math.floor(width / SCALE),
    Math.floor(height / SCALE),
  );
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

interface BufferData {
  buffer: WebGLFramebuffer;
  texture: WebGLTexture;
  index: number;
}

function createBuffer(
  gl: WebGLRenderingContext,
  width: number,
  height: number,
  index: 0 | 2,
): BufferData {
  const buffer = gl.createFramebuffer()!;
  gl.getExtension('OES_texture_float');
  const texture = gl.createTexture()!;
  gl.activeTexture(gl.TEXTURE0 + index);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    Math.floor(width / SCALE),
    Math.floor(height / SCALE),
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
  return { buffer, texture, index };
}
