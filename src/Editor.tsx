import React from 'react';

import { Automaton, State } from './types';
import { Action } from './action';

interface EditorProps {
  automaton: Automaton;
  dispatch: React.Dispatch<Action>;
}

export function Editor({ automaton: { states }, dispatch }: EditorProps) {
  return (
    <div>
      {states.map((state, i) => (
        <StateEditor key={i} id={i} state={state} dispatch={dispatch} />
      ))}
    </div>
  );
}

interface StateEditorProps {
  state: State;
  id: number;
  dispatch: React.Dispatch<Action>;
}

export function StateEditor({ state, id, dispatch }: StateEditorProps) {
  return (
    <div>
      <input
        type="text"
        value={state.name}
        onChange={({ target: { value } }) => {
          dispatch({ type: 'EDIT_STATE_NAME', id, name: value });
        }}
      ></input>
      <input
        type="color"
        value={state.color}
        onChange={({ target: { value } }) => {
          dispatch({ type: 'EDIT_STATE_COLOR', id, color: value });
        }}
      ></input>
    </div>
  );
}
