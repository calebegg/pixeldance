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

import { Immutable } from 'immer';

export type Automaton = Immutable<{
  states: State[];
  rules: Rule[];
}>;

export type State = Immutable<{
  name: string;
  color: string;
  id: number;
}>;

export type Block = Immutable<[[Query, Query], [Query, Query]]>;

export type Query = Immutable<{
  /** Matches cells with this ID (but see below) */
  id?: number;
  /** Matches cells that *don't* match ID */
  negate?: true;
  /** Matches all cells. Other fields are ignored if this is specified. */
  all?: true;
}>;

export type Rule = Immutable<{
  before: Block;
  after: Array<{
    probability?: number;
    result: Block;
  }>;
  symmetries?: {
    horizontal?: boolean;
    vertical?: boolean;
  };
}>;
