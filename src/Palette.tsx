import { State } from './types';
import React, { Dispatch } from 'react';
import { Action } from './action';

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
