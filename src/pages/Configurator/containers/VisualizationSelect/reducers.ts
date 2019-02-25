import { Visualization } from './interfaces';

export function update(state: any, key: string, value: any) {
  return {
    ...state,
    [key]: value,
  };
}
