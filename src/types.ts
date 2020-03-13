export interface State {
  name: string;
  color: string;
}

export type Block = readonly [
  readonly [string, string],
  readonly [string, string],
];

export interface Rule {
  before: Block;
  after: Array<{ probability?: number; result: Block }>;
  symmetry?: 'horizontal';
}

export interface Config {
  states: State[];
  rules: Rule[];
}
