import * as visualizers from '../../../../visualizers';
import { requestSaveConfig } from '../../../../helpers/coms';

import { VisualizerMetadata } from './interfaces';

export default function VisualizationSelectEffects(dispatch: any) {
  return {
    initializeList() {
      const items = Object.keys(visualizers).map((item: string) => {
        const obj: VisualizerMetadata = (visualizers as any)[item];

        return { label: obj.name, value: obj.id };
      });

      dispatch.visualizations.update('list', items);
    },
    select(visualizer: string) {
      requestSaveConfig({ visualizer });
      dispatch.visualizations.update('selected', visualizer);
    },
    async addVisualization(url: string) {
      let isSuccess = false;
      dispatch.visualizations.update('isLoading', true);

      try {
        const raw = await fetch(url);
        const response = await raw.json();

        isSuccess = true;

        console.log(response);
      } catch (error) {
        console.error(error);
      }

      dispatch.visualizations.update('isLoading', false);

      return isSuccess;
    },
  };
}
