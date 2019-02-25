import * as React from 'react';
import xjs from 'xjs-framework/dist/xjs-es2015';

import { addListener, removeListener } from '../helpers/coms';

const { useState, useEffect } = React;

export default function usePluginInit(config: any) {
  const { visualizer, audio } = config;

  useEffect(() => {
    // Load visualizer
    const lib = require(`../visualizers/${visualizer}/visualizer`);
    window.init(config);

    // @TODO:
    // We might want to simply read the whole file and then execute it similar to an eval
    // This is to allow custom visualizers to work with using the same logic.
  }, [visualizer]);
  return config;
}
