import React from 'react';

import { Automaton, State, Rule, Query, Block } from './types';
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
      {states.map(state => (
        <StateEditor
          key={state.id}
          id={state.id}
          state={state}
          dispatch={dispatch}
        />
      ))}
      <button
        onClick={() => {
          dispatch({ type: 'ADD_STATE' });
        }}
      >
        [+] New state
      </button>
      <h2>Rules</h2>
      {rules.map((rule, i) => (
        <RuleEditor
          key={i}
          index={i}
          rule={rule}
          states={states}
          dispatch={dispatch}
        />
      ))}
      <button
        onClick={() => {
          dispatch({ type: 'ADD_RULE' });
        }}
      >
        [+] New rule
      </button>
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
      id: {id}
    </div>
  );
}

interface RuleEditorProps {
  rule: Rule;
  states: readonly State[];
  index: number;
  dispatch: React.Dispatch<Action>;
}

export function RuleEditor({ rule, states, index, dispatch }: RuleEditorProps) {
  return (
    <div className="rule-editor">
      <div className="before">
        <BlockEditor
          states={states}
          value={rule.before}
          onChange={({ offset, query }) =>
            dispatch({
              type: 'EDIT_RULE_BEFORE',
              ruleIndex: index,
              beforeIndex: offset,
              query,
            })
          }
        />
      </div>
      <div>=></div>
      {rule.after.map((a, i) => (
        <div key={i} className="after">
          <BlockEditor
            states={states}
            value={a.result}
            onChange={({ offset, query }) =>
              dispatch({
                type: 'EDIT_RULE_AFTER_RESULT',
                ruleIndex: index,
                afterIndex: i,
                resultIndex: offset,
                query,
              })
            }
          />
        </div>
      ))}
    </div>
  );
}

export function StateSelect({
  states,
  value,
  onChange,
}: {
  states: readonly State[];
  value: Query;
  onChange: (value: Query) => void;
}) {
  return (
    <select
      value={JSON.stringify(value)}
      onChange={({ target: { value } }) => {
        onChange(JSON.parse(value));
      }}
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

function BlockEditor({
  states,
  value,
  onChange,
}: {
  states: readonly State[];
  value: Block;
  onChange: (value: { query: Query; offset: [0 | 1, 0 | 1] }) => void;
}) {
  return (
    <>
      <div className="row">
        <StateSelect
          states={states}
          value={value[0][0]}
          onChange={query => {
            onChange({ query, offset: [0, 0] });
          }}
        />
        <StateSelect
          states={states}
          value={value[0][1]}
          onChange={query => {
            onChange({ query, offset: [0, 1] });
          }}
        />
      </div>
      <div className="row">
        <StateSelect
          states={states}
          value={value[1][0]}
          onChange={query => {
            onChange({ query, offset: [1, 0] });
          }}
        />
        <StateSelect
          states={states}
          value={value[1][1]}
          onChange={query => {
            onChange({ query, offset: [1, 1] });
          }}
        />
      </div>
    </>
  );
}
