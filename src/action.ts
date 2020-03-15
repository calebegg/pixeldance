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
