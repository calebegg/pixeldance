import React, { useReducer, useState } from 'react';
import { Editor } from './Editor';
import { Preview } from './Preview';

import { DEFAULT_CONFIG } from './defaultConfig';

import { Automaton } from './types';
import { Action } from './action';
import produce, { Draft } from 'immer';
import { Palette } from './Palette';

const update = produce((draft: Draft<Automaton>, action: Action) => {
  switch (action.type) {
    case 'EDIT_STATE_NAME':
      draft.states[action.id].name = action.name;
      break;
    case 'EDIT_STATE_COLOR':
      draft.states[action.id].color = action.color;
      break;
  }
});

export function App() {
  let [automaton, dispatch] = useReducer(update, DEFAULT_CONFIG);
  let [clickState, setClickState] = useState(1);

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Editor automaton={automaton} dispatch={dispatch} />
        <Palette
          states={automaton.states}
          value={clickState}
          onChange={v => {
            setClickState(v);
          }}
        />
      </div>
      <Preview automaton={automaton} clickState={clickState} />
    </>
  );
}
