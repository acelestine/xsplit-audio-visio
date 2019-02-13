import { Visualization } from './interfaces';

export function setList(state: any, list: Visualization[]) {
  return {
    ...state,
    list,
  };
}

export function select(state: any, selected: string) {
  return {
    ...state,
    selected,
  };
}
