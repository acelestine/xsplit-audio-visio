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
  };
}
