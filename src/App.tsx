import React, { useReducer } from 'react';
import { Editor } from './Editor';
import { Preview } from './Preview';

import { DEFAULT_CONFIG } from './defaultConfig';

import { Automaton } from './types';
import { Action } from './action';
import produce, { Draft } from 'immer';

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

  return (
    <>
      <h1>Hello, world!</h1>
      <Editor automaton={automaton} dispatch={dispatch} />
      <Preview automaton={automaton} />
    </>
  );
}
