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

import { Automaton } from './types';

export const DEFAULT_CONFIG: Automaton = {
  states: [
    { name: 'air', color: '#14CAEB', id: 0 },
    { name: 'sand', color: '#ffd415', id: 1 },
    { name: 'wall', color: '#000000', id: 2 },
    { name: 'water', color: '#1057A3', id: 3 },
    { name: 'ant-r', color: '#880000', id: 4 },
    { name: 'ant-l', color: '#880000', id: 5 },
    { name: 'steam', color: '#dfefff', id: 6 },
    { name: 'acid', color: '#44ff00', id: 7 },
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
      symmetries: { horizontal: true },
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
      symmetries: { horizontal: true },
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
      symmetries: { horizontal: true },
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
      symmetries: { horizontal: true },
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
      symmetries: { horizontal: true },
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
      symmetries: { horizontal: true },
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
    {
      before: [
        [{ id: 0 }, { all: true }],
        [{ id: 6 }, { all: true }],
      ],
      after: [
        {
          probability: 0.5,
          result: [
            [{ id: 6 }, { all: true }],
            [{ id: 0 }, { all: true }],
          ],
        },
      ],
      symmetries: { horizontal: true },
    },
    {
      before: [
        [{ id: 6 }, { all: true }],
        [{ id: 0 }, { all: true }],
      ],
      after: [
        {
          probability: 0.25,
          result: [
            [{ id: 0 }, { all: true }],
            [{ id: 6 }, { all: true }],
          ],
        },
      ],
      symmetries: { horizontal: true },
    },
    {
      before: [
        [{ id: 6 }, { id: 0 }],
        [{ all: true }, { all: true }],
      ],
      after: [
        {
          probability: 0.5,
          result: [
            [{ id: 0 }, { id: 6 }],
            [{ all: true }, { all: true }],
          ],
        },
      ],
      symmetries: { horizontal: true, vertical: true },
    },
    {
      before: [
        [{ id: 7 }, { all: true }],
        [{ id: 0 }, { all: true }],
      ],
      after: [
        {
          result: [
            [{ id: 0 }, { all: true }],
            [{ id: 7 }, { all: true }],
          ],
        },
      ],
      symmetries: { horizontal: true },
    },
    {
      before: [
        [{ id: 7 }, { id: 2, negate: true }],
        [{ all: true }, { all: true }],
      ],
      after: [
        {
          probability: 0.5,
          result: [
            [{ id: 7 }, { id: 0 }],
            [{ all: true }, { all: true }],
          ],
        },
      ],
      symmetries: { horizontal: true },
    },
    {
      before: [
        [{ id: 7 }, { all: true }],
        [{ id: 2, negate: true }, { all: true }],
      ],
      after: [
        {
          probability: 0.75,
          result: [
            [{ id: 7 }, { all: true }],
            [{ id: 0 }, { all: true }],
          ],
        },
      ],
      symmetries: { horizontal: true, vertical: true },
    },
  ],
};
