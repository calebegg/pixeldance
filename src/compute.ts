import { Rule, Block, Automaton } from './types';

const HEADER = `
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

vec4 eq(int x, int y) { return 1.0 - vec4(abs(sign(float(x) - float(y)))); }
vec4 eq(float x, float y) { return 1.0 - vec4(abs(sign(x - y))); }
vec4 eq(vec4 x, vec4 y) { return 1.0 - abs(sign(x - y)); }

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

  vec2 ul;
  ul.x = x - mod(x + OFFSET.x, 2.0) + 0.5;
  ul.y = y - mod(y + OFFSET.y, 2.0) + 0.5;

  float threshold = rand(ul);

  vec4 UNSET = vec4(0);
  vec4 color = UNSET;
`;

const FOOTER = `
if (color != UNSET) {
  gl_FragColor = color;
}
`;

export function computeShader(
  automaton: Automaton,
  indices: Map<string, number>,
) {
  return `${HEADER}
    ${automaton.rules.map(r => createRule(r, indices)).join('')}
    ${FOOTER}
  }
  `;
}

function createRule(r: Rule, indices: Map<string, number>): string {
  if (r.symmetry === 'horizontal') {
    return (
      createRule({ ...r, symmetry: undefined }, indices) +
      createRule(
        {
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
        },
        indices,
      )
    );
  }
  return `
  color += eq(color, UNSET) *
    ${createBeforeCondition(r.before, indices)}
    * (
      ${r.after.map((a, i) => createAfterResult(a.result, indices)).join(' + ')}
    );
`;
}

function createBeforeCondition(before: Block, indices: Map<string, number>) {
  return before
    .flatMap((row, dy) =>
      row.map((s, dx) => {
        if (s === '*') {
          return null;
        } else if (s.startsWith('^')) {
          return `(1.0 - eq(at(ul.x + ${dx}.0, ul.y + ${dy}.0), ${indices.get(
            s.substring(1),
          )})`;
        } else {
          return `eq(at(ul.x + ${dx}.0, ul.y + ${dy}.0), ${indices.get(s)})`;
        }
      }),
    )
    .filter(v => !!v)
    .join(' * ');
}

function createAfterResult(result: Block, indices: Map<string, number>) {
  return result
    .flatMap((row, dy) =>
      row.map((s, dx) =>
        s === '*'
          ? ''
          : `
            eq(x, ul.x + ${dx}.0) *
            eq(y, ul.y + ${dy}.0) *
            encode(${indices.get(s)})
            `,
      ),
    )
    .filter(term => !!term)
    .join(' + ');
}
