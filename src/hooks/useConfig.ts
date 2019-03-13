import * as React from 'react';
import xjs from 'xjs-framework/dist/xjs-es2015';

import { addListener, removeListener } from '../helpers/coms';
import { isSourceProps } from '../helpers/environment';
import { getIdentifier } from '../helpers/identifier';

const { useState, useEffect } = React;
const identifier = getIdentifier(location.href);

export default function useConfig(callback?: Function) {
  const [initialized, setInitialized] = useState(false); // @HACK
  const [config, setConfig] = useState(null as any);

  // This will only be used by the source plugin
  function handleSaveConfig(config: any) {
    setConfig(config);

    localStorage.setItem(
      'plugin-config',
      JSON.stringify({
        id: `audio-visualizer-${identifier}`,
        value: Date.now(),
      })
    );

    if (callback) {
      callback(config);
    }
  }

  useEffect(() => {
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

    window.addEventListener('storage', () => {});
  }, [initialized]);

  return config;
}
