import { Immutable } from 'immer';

export type Automaton = Immutable<{
  states: State[];
  rules: Rule[];
}>;

export type State = Immutable<{
  name: string;
  color: string;
  id: number;
}>;

export type Block = Immutable<[[Query, Query], [Query, Query]]>;

export type Query = Immutable<
  | {
      /** Matches cells with this ID (but see below) */
      id?: number;
      /** Matches cells that *don't* match ID */
      negate?: boolean;
      all?: false;
    }
  | {
      /** Matches all cells. Other fields are ignored if this is specified. */
      all: true;
    }
>;

export type Rule = Immutable<{
  before: Block;
  after: Array<{
    probability?: number;
    result: Block;
  }>;
  symmetry?: 'horizontal';
}>;
