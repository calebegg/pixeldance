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
    };
