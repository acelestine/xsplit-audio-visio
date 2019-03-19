import * as reducers from './reducers';
import effects from './effects';
import selectors from './selectors';

export default {
  state: {
    list: [],
    selected: 'bars',
    isLoading: false,
  },
  reducers,
  effects,
  selectors,
};
