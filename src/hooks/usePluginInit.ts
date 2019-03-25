import * as React from 'react';
import { default as InitBars } from '../visualizers/Bars/visualizer';
import { default as InitWave } from '../visualizers/Wave/visualizer';

import { addListener, removeListener } from '../helpers/coms';

const { useState, useEffect } = React;

export default function usePluginInit(config: any) {
  const { visualizer = 'bars' } = config;
  useEffect(() => {
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
  });
  return config;
}
