import { Automaton } from './types';

export const DEFAULT_CONFIG: Automaton = {
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
