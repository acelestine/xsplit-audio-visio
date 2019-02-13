import * as visualizers from '../../../../visualizers';

import { VisualizerMetadata } from './interfaces';

export default function VisualizationSelectEffects(dispatch: any) {
  return {
    initializeList() {
      const items = Object.keys(visualizers).map((item: string) => {
        const obj: VisualizerMetadata = (visualizers as any)[item];

        return { label: obj.name, value: obj.id };
      });

      dispatch.visualizations.setList(items);
    },
    selectVisualizer(visualizer: string) {
      // @TODO: We should communicate this back to the HTML plugin
      dispatch.visualizations.select(visualizer);
    },
  };
}
