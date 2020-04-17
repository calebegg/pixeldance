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

import { Query } from './types';
import { Draft } from 'immer';

export type Action =
  | {
      type: 'ADD_STATE';
    }
  | {
      type: 'REMOVE_STATE';
      id: number;
    }
  | {
      type: 'EDIT_STATE_NAME';
      id: number;
      name: string;
    }
  | {
      type: 'EDIT_STATE_COLOR';
      id: number;
      color: string;
    }
  | {
      type: 'ADD_RULE';
    }
  | {
      type: 'EDIT_RULE_BEFORE';
      ruleIndex: number;
      beforeIndex: [0 | 1, 0 | 1];
      query: Draft<Query>;
    }
  | {
      type: 'EDIT_RULE_AFTER_RESULT';
      ruleIndex: number;
      afterIndex: number;
      resultIndex: [0 | 1, 0 | 1];
      query: Draft<Query>;
    };
