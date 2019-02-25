import * as React from 'react';
import xjs from 'xjs-framework/dist/xjs-es2015';

import { addListener, removeListener } from '../helpers/coms';

const { useState, useEffect } = React;

export default function usePluginInit(config: any) {
  const { visualizer, audio } = config;

  useEffect(() => {
    console.log(visualizer);
  }, [visualizer]);
  return config;
}
