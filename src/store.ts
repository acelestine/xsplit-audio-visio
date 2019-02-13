import { init } from '@rematch/core';
import * as configModels from './pages/Configurator/models';

const store = init({
  models: {
    ...configModels,
  },
});

export default store;
