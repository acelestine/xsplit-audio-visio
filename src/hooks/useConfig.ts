import * as React from 'react';
import xjs from 'xjs-framework/dist/xjs-es2015';

import { addListener, removeListener } from '../helpers/coms';
import { isSourceProps } from '../helpers/environment';

const { useState, useEffect } = React;

export default function useConfig(callback?: Function) {
  const [initialized, setInitialized] = useState(false);
  const [config, setConfig] = useState(null as any);

  function handleSaveConfig(config: any) {
    setConfig(config);

    if (callback) {
      callback(config);
    }
  }

  useEffect(() => {
    if (!initialized) {
      xjs.Source.getCurrentSource()
        .then((source: any) => source.loadConfig())
        .then((initialConfig: any) => {
          setInitialized(true);
          setConfig(initialConfig);
        });

      if (!isSourceProps()) {
        addListener('save-config', handleSaveConfig);

        return () => {
          removeListener('save-config', handleSaveConfig);
        };
      }
    }
  });

  return config;
}
