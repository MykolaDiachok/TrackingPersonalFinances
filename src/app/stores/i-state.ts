export enum StateStatus {
  Start,
  Initialized,
  NotLoaded,
  Loading,
  Loaded,
  Failed,
  Cleared,
  Error,
}

export interface IState {
  statusState?: StateStatus;
}
