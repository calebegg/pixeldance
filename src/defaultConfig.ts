import { Automaton } from './types';

export const DEFAULT_CONFIG: Automaton = {
  states: [
    { name: 'air', color: '#14CAEB', id: 0 },
    { name: 'sand', color: '#ffd415', id: 1 },
    { name: 'wall', color: '#000000', id: 2 },
    { name: 'water', color: '#1057A3', id: 3 },
    { name: 'dune-buggy-right', color: '#FD0496', id: 4 },
    { name: 'dune-buggy-left', color: '#FD0496', id: 5 },
  ],
  rules: [
    {
      before: [
        [{ id: 1 }, { all: true }],
        [{ id: 0 }, { all: true }],
      ],
      after: [
        {
          result: [
            [{ id: 0 }, { all: true }],
            [{ id: 1 }, { all: true }],
          ],
        },
      ],
      symmetry: 'horizontal',
    },
    {
      before: [
        [{ id: 1 }, { id: 0 }],
        [{ id: 1 }, { id: 0 }],
      ],
      after: [
        {
          result: [
            [{ id: 0 }, { id: 0 }],
            [{ id: 1 }, { id: 1 }],
          ],
        },
      ],
      symmetry: 'horizontal',
    },
    {
      before: [
        [{ id: 3 }, { all: true }],
        [{ id: 0 }, { all: true }],
      ],
      after: [
        {
          result: [
            [{ id: 0 }, { all: true }],
            [{ id: 3 }, { all: true }],
          ],
        },
      ],
      symmetry: 'horizontal',
    },
    {
      before: [
        [{ id: 3 }, { id: 0 }],
        [{ id: 3 }, { id: 0 }],
      ],
      after: [
        {
          result: [
            [{ id: 0 }, { id: 0 }],
            [{ id: 3 }, { id: 3 }],
          ],
        },
      ],
    },
    {
      before: [
        [{ id: 0 }, { id: 3 }],
        [{ id: 0 }, { id: 3 }],
      ],
      after: [
        {
          result: [
            [{ id: 0 }, { id: 0 }],
            [{ id: 3 }, { id: 3 }],
          ],
        },
      ],
    },
    {
      before: [
        [{ id: 0 }, { id: 3 }],
        [{ all: true }, { id: 0, negate: true }],
      ],
      after: [
        {
          probability: 0.75,
          result: [
            [{ id: 3 }, { id: 0 }],
            [{ all: true }, { all: true }],
          ],
        },
      ],
      symmetry: 'horizontal',
    },
    {
      before: [
        [{ id: 4 }, { all: true }],
        [{ id: 0 }, { all: true }],
      ],
      after: [
        {
          result: [
            [{ id: 0 }, { all: true }],
            [{ id: 4 }, { all: true }],
          ],
        },
      ],
      symmetry: 'horizontal',
    },
    {
      before: [
        [{ id: 4 }, { id: 0 }],
        [
          { id: 0, negate: true },
          { id: 0, negate: true },
        ],
      ],
      after: [
        {
          result: [
            [{ id: 0 }, { id: 4 }],
            [{ all: true }, { all: true }],
          ],
        },
      ],
    },
    {
      before: [
        [{ id: 4 }, { id: 0 }],
        [{ id: 0, negate: true }, { id: 0 }],
      ],
      after: [
        {
          result: [
            [{ id: 0 }, { id: 0 }],
            [{ all: true }, { id: 4 }],
          ],
        },
      ],
    },
    {
      before: [
        [{ id: 0 }, { id: 0 }],
        [{ id: 4 }, { id: 0, negate: true }],
      ],
      after: [
        {
          result: [
            [{ id: 0 }, { id: 4 }],
            [{ id: 0 }, { all: true }],
          ],
        },
      ],
    },
    {
      before: [
        [{ all: true }, { id: 0, negate: true }],
        [{ id: 4 }, { id: 0, negate: true }],
      ],
      after: [
        {
          result: [
            [{ all: true }, { all: true }],
            [{ id: 5 }, { all: true }],
          ],
        },
      ],
    },
    {
      before: [
        [{ id: 5 }, { all: true }],
        [{ id: 0 }, { all: true }],
      ],
      after: [
        {
          result: [
            [{ id: 0 }, { all: true }],
            [{ id: 5 }, { all: true }],
          ],
        },
      ],
      symmetry: 'horizontal',
    },
    {
      before: [
        [{ id: 0 }, { id: 5 }],
        [
          { id: 0, negate: true },
          { id: 0, negate: true },
        ],
      ],
      after: [
        {
          result: [
            [{ id: 5 }, { id: 0 }],
            [{ all: true }, { all: true }],
          ],
        },
      ],
    },
    {
      before: [
        [{ id: 0 }, { id: 5 }],
        [{ id: 0 }, { id: 0, negate: true }],
      ],
      after: [
        {
          result: [
            [{ id: 0 }, { id: 0 }],
            [{ id: 5 }, { all: true }],
          ],
        },
      ],
    },
    {
      before: [
        [{ id: 0 }, { id: 0 }],
        [{ id: 0, negate: true }, { id: 5 }],
      ],
      after: [
        {
          result: [
            [{ id: 5 }, { id: 0 }],
            [{ all: true }, { id: 0 }],
          ],
        },
      ],
    },
    {
      before: [
        [{ id: 0, negate: true }, { all: true }],
        [{ id: 0, negate: true }, { id: 5 }],
      ],
      after: [
        {
          result: [
            [{ all: true }, { all: true }],
            [{ all: true }, { id: 4 }],
          ],
        },
      ],
    },
  ],
};
