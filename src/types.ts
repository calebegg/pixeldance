import { Immutable } from 'immer';

export type Automaton = Immutable<{
  states: State[];
  rules: Rule[];
}>;

export type State = Immutable<{
  name: string;
  color: string;
}>;

export type Block = Immutable<[[string, string], [string, string]]>;

export type Rule = Immutable<{
  before: Block;
  after: Array<{
    probability?: number;
    result: Block;
  }>;
  symmetry?: 'horizontal';
}>;
