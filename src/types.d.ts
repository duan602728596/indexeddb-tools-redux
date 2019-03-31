export interface IDBEvent {
  target: {
    result: IDBDatabase;
  };
}

export interface ActionArgument {
  objectStoreName: string;
  successAction: Function;
  failAction: Function;
}

export interface Query {
  query: string | number;
}

export interface Data {
  data: Array<object> | object;
}

export interface CursorQuery {
  indexName: string;
  range?: string | number;
}

export interface Cursor {
  query: CursorQuery;
}