import React from 'react';

import { Automaton, State, Rule, Query } from './types';
import { Action } from './action';

interface EditorProps {
  automaton: Automaton;
  dispatch: React.Dispatch<Action>;
}

export function Editor({
  automaton: { states, rules },
  dispatch,
}: EditorProps) {
  return (
    <details>
      <summary></summary>
      <h2>States</h2>
      {states.map((state, i) => (
        <StateEditor key={i} id={i} state={state} dispatch={dispatch} />
      ))}
      <h2>Rules</h2>
      {rules.map((rule, i) => (
        <RuleEditor
          key={i}
          id={i}
          rule={rule}
          states={states}
          dispatch={dispatch}
        />
      ))}
    </details>
  );
}

interface StateEditorProps {
  state: State;
  id: number;
  dispatch: React.Dispatch<Action>;
}

export function StateEditor({ state, id, dispatch }: StateEditorProps) {
  return (
    <div className="state-editor">
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

interface RuleEditorProps {
  rule: Rule;
  states: readonly State[];
  id: number;
  dispatch: React.Dispatch<Action>;
}

export function RuleEditor({ rule, states, id, dispatch }: RuleEditorProps) {
  return (
    <div className="rule-editor">
      <div className="before">
        <div className="row">
          <StateSelect states={states} value={rule.before[0][0]} />
          <StateSelect states={states} value={rule.before[0][1]} />
        </div>
        <div className="row">
          <StateSelect states={states} value={rule.before[1][0]} />
          <StateSelect states={states} value={rule.before[1][1]} />
        </div>
      </div>
      <div>=></div>
      {rule.after.map((a, i) => (
        <div key={i} className="after">
          <div className="row">
            <StateSelect states={states} value={a.result[0][0]} />
            <StateSelect states={states} value={a.result[0][1]} />
          </div>
          <div className="row">
            <StateSelect states={states} value={a.result[1][0]} />
            <StateSelect states={states} value={a.result[1][1]} />
          </div>
        </div>
      ))}
    </div>
  );
}

interface StateSelectProps {
  states: readonly State[];
  value: Query;
  onChange?: (value: number) => void;
}

export function StateSelect({ states, value, onChange }: StateSelectProps) {
  return (
    <select
      value={JSON.stringify(value)}
      style={{ backgroundColor: states.find(s => s.id === value.id)?.color }}
    >
      <option value="{all: true}">*</option>
      {states.map(s => (
        <option key={s.id} value={JSON.stringify({ id: s.id })}>
          {s.name}
        </option>
      ))}
      {states.map((s, id) => (
        <option key={s.id} value={JSON.stringify({ id: s.id, negate: true })}>
          ^{s.name}
        </option>
      ))}
    </select>
  );
}
