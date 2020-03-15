import React, { useReducer, useState } from 'react';
import { Editor } from './Editor';
import { Preview } from './Preview';

import { DEFAULT_CONFIG } from './defaultConfig';

import { Automaton, Rule } from './types';
import { Action } from './action';
import produce, { Draft } from 'immer';
import { Palette } from './Palette';

const update = produce((draft: Draft<Automaton>, action: Action) => {
  switch (action.type) {
    case 'ADD_STATE':
      const ids = draft.states.map(s => s.id).sort((a, b) => a - b);
      const firstIdxAfterUnused = ids.findIndex((id, idx) => id != idx);
      let newId;
      if (firstIdxAfterUnused == 0) newId = 0;
      else if (firstIdxAfterUnused == -1) newId = ids.length;
      else newId = ids[firstIdxAfterUnused - 1] + 1;
      draft.states.push({
        name: '',
        color:
          '#' +
          Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, '0'),
        id: newId,
      });
      break;
    case 'EDIT_STATE_NAME':
      draft.states[action.id].name = action.name;
      break;
    case 'EDIT_STATE_COLOR':
      draft.states[action.id].color = action.color;
      break;
    case 'EDIT_RULE_BEFORE':
      draft.rules[action.ruleIndex].before[action.beforeIndex[0]][
        action.beforeIndex[1]
      ] = action.query;
      break;
    case 'EDIT_RULE_AFTER_RESULT':
      draft.rules[action.ruleIndex].after[action.afterIndex].result[
        action.resultIndex[0]
      ][action.resultIndex[1]] = action.query;
      break;
  }
});

export function App() {
  let [automaton, dispatch] = useReducer(update, DEFAULT_CONFIG);
  let [clickState, setClickState] = useState(1);

  return (
    <>
      <Editor automaton={automaton} dispatch={dispatch} />
      <Palette
        states={automaton.states}
        value={clickState}
        onChange={v => {
          setClickState(v);
        }}
      />
      <Preview automaton={automaton} clickState={clickState} />
    </>
  );
}
