import { Rule, Block, Automaton } from './types';

const HEADER = `
precision mediump float;

uniform vec2 RESOLUTION;
uniform sampler2D DATA;
uniform vec2 OFFSET;
uniform vec2 CLICK;
uniform int CLICK_STATE;
uniform float FRAME;

// Modified from http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(vec2(co.x - FRAME, co.y + FRAME) ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

vec4 encode(int val) { return vec4(float(val), 0.0, 0.0, 1.0); }
int at(float x, float y) {
  return int(texture2D(DATA, vec2(x, RESOLUTION.y - y) / RESOLUTION).r);
}

void main() {
  float x = gl_FragCoord.x;
  float y = RESOLUTION.y - gl_FragCoord.y;

  gl_FragColor = encode(at(x, y));

  if (x == CLICK.x + 0.5 && y == CLICK.y + 0.5) {
    gl_FragColor = encode(CLICK_STATE);
    return;
  }

  // Walls
  if (y == RESOLUTION.y - 0.5 || x == RESOLUTION.x - 0.5 || x == 0.5) {
    gl_FragColor = encode(2);
    return;
  }
  // Sand source
  if (FRAME < 200.0 && y == 1.5 && rand(vec2(x, y)) > .92) {
    gl_FragColor = encode(1);
  }

  if (FRAME == 201.0 && y == 1.5 && x == 1.5) {
    gl_FragColor = encode(4);
  }
  if (FRAME == 201.0 && y == 1.5 && x == RESOLUTION.x - 1.5) {
    gl_FragColor = encode(5);
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
`;

export function computeShader(automaton: Automaton) {
  return `${HEADER}
    float threshold = rand(ul);
    ${automaton.rules.map(r => createRule(r)).join('')}
  }
  `;
}

function createRule(r: Rule): string {
  if (r.symmetries) {
    const rules = [createRule({ ...r, symmetries: undefined })];
    if (r.symmetries.horizontal) {
      rules.push(
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
        }),
      );
    }
    if (r.symmetries.vertical) {
      rules.push(
        createRule({
          before: [
            [r.before[1][0], r.before[1][1]],
            [r.before[0][0], r.before[0][1]],
          ],
          after: r.after.map(a => ({
            ...a,
            result: [
              [a.result[1][0], a.result[1][1]],
              [a.result[0][0], a.result[0][1]],
            ],
          })),
        }),
      );
    }
    return rules.join('\n');
  }

  let probSum = 0;
  return `
  if (${createBeforeCondition(r.before)}) {
      ${r.after
        .map((a, i) => {
          const body = `${createAfterResult(a.result)} return;`;
          if (a.probability != null) {
            probSum += a.probability;
          }
          return `
            if (${
              a.probability == null
                ? 'true'
                : `threshold < ${probSum.toFixed(3)}`
            }) {${body}}`;
        })
        .join(' else ')}
  }
`;
}

function createBeforeCondition(before: Block) {
  return before
    .flatMap((row, dy) =>
      row.map((q, dx) => {
        if (q.all) {
          return null;
        } else if (q.negate) {
          return `at(ul.x + ${dx}.0, ul.y + ${dy}.0) != ${q.id}`;
        } else {
          return `at(ul.x + ${dx}.0, ul.y + ${dy}.0) == ${q.id}`;
        }
      }),
    )
    .filter(v => !!v)
    .join(' && ');
}

function createAfterResult(result: Block) {
  return result
    .flatMap((row, dy) =>
      row.map((q, dx) =>
        q.all
          ? ''
          : `
            if (x == ul.x + ${dx}.0 && y == ul.y + ${dy}.0) {
              gl_FragColor = encode(${q.id});
            }
            `,
      ),
    )
    .filter(term => !!term)
    .join(' else ');
}
