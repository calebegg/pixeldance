import { Automaton } from './types';

export const DEFAULT_CONFIG: Automaton = {
  states: [
    { name: 'air', color: '#14CAEB' },
    { name: 'sand', color: '#ffd415' },
    { name: 'wall', color: '#000000' },
    { name: 'water', color: '#1057A3' },
    { name: 'dune-buggy-right', color: '#FD0496' },
    { name: 'dune-buggy-left', color: '#FD0496' },
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
      symmetry: 'horizontal',
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
      symmetry: 'horizontal',
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
      symmetry: 'horizontal',
    },
    {
      before: [
        ['dune-buggy-right', 'air'],
        ['^air', '^air'],
      ],
      after: [
        {
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
      symmetry: 'horizontal',
    },
    {
      before: [
        ['air', 'dune-buggy-left'],
        ['^air', '^air'],
      ],
      after: [
        {
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
          result: [
            ['*', '*'],
            ['*', 'dune-buggy-right'],
          ],
        },
      ],
    },
  ],
};
