import { init } from '@rematch/core';
import selectPlugin from '@rematch/select';
import * as configModels from './pages/Configurator/models';

const store = init({
  plugins: [selectPlugin()],
  models: {
    ...configModels,
  },
});

export default store;
