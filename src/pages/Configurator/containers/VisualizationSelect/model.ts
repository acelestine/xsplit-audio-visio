import * as reducers from './reducers';
import effects from './effects';

export default {
  state: {
    list: [],
    selected: 'bars',
  },
  reducers,
  effects,
};
