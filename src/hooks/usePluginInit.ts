import * as React from 'react';
import { default as InitBars } from '../visualizers/Bars/visualizer';
import { default as InitWave } from '../visualizers/Wave/visualizer';

const { useEffect } = React;

export default function usePluginInit(config: any) {
  const { visualizer } = config;

  useEffect(() => {
    if (!visualizer) {
      return;
    }

    switch (visualizer) {
      case 'bars':
        InitBars(config);
        break;

      case 'wave':
        InitWave(config);
        break;

      default:
      // @TODO: Handle dynamic visualizers
    }
  }, [visualizer]);

  return config;
}
