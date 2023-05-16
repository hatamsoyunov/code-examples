export type Nullable<T> = T | null;

export interface IErrorFromParam {
  [key: string]: string[];
}

export interface IBaseStore {
  sync?: () => void; // called at app start
  reset: () => void; // called at logout
}
