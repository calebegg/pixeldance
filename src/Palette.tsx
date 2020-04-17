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

import { State } from './types';
import React from 'react';

interface PaletteProps {
  states: readonly State[];
  value: number;
  onChange: (id: number) => void;
}

export function Palette({ states, value, onChange }: PaletteProps) {
  return (
    <div className="palette">
      {states.map(s => (
        <label key={s.id}>
          <input
            type="radio"
            checked={s.id === value}
            onChange={e => {
              onChange(s.id);
            }}
          />
          <div style={{ backgroundColor: s.color }}>{s.name}</div>
        </label>
      ))}
    </div>
  );
}
