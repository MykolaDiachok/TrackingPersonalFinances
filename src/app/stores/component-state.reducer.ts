import { Action, createAction, props, Store } from '@ngrx/store';
import { IState } from './i-state';
import { distinctUntilChanged, Observable, Subscription } from 'rxjs';

export const COMPONENT_STORE_UPDATE = '[Store] Update';

export interface DynamicUpdateAction {
  type: string;
  componentName: string;
  componentState: IState;
}

export function createDynamicUpdateAction(componentName: string) {
  const actionType = `${COMPONENT_STORE_UPDATE} ${componentName} ${new Date().toLocaleTimeString()}`;
  return createAction(actionType, props<{ componentName: string; componentState: IState }>());
}

export interface ComponentState {
  [componentName: string]: IState;
}

export function componentStateReducer(state: ComponentState | undefined, action: Action) {
  if (action.type.startsWith(COMPONENT_STORE_UPDATE)) {
    const updateAction = action as DynamicUpdateAction;
    return {
      ...state,
      [updateAction.componentName]: updateAction.componentState,
    };
  }
  return state;
}

export const linkToGlobalState = (
  componentState$: Observable<IState>,
  componentName: string,
  globalStore: Store,
): Subscription =>
  componentState$.pipe(distinctUntilChanged()).subscribe((componentState) => {
    const action = createDynamicUpdateAction(componentName)({ componentName, componentState });
    globalStore.dispatch(action);
  });
