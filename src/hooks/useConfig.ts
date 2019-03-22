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

  function createHandleStorageEvent(currentSource: any) {
    return ({ oldValue, newValue, key }: StorageEvent) => {
      if (key !== 'plugin-config') {
        return; // Do nothing
      }

      try {
        // This shouldn't happen, storage should not get triggered if old and new are the same... but just in case...
        if (newValue === oldValue) {
          return;
        }

        const data = JSON.parse(newValue as string);

        if (data.id !== `audio-visualizer-${identifier}`) {
          return;
        }

        currentSource
          .then((source: any) => source.loadConfig())
          .then((initialConfig: any) => {
            setConfig(initialConfig);
          });
      } catch (error) {
        // DO nothing
      }
    };
  }

  useEffect(() => {
    const currentSource = xjs.Source.getCurrentSource();

    currentSource
      .then((source: any) => source.loadConfig())
      .then((initialConfig: any) => {
        setInitialized(true);
        setConfig(initialConfig);

        if (callback) {
          callback(initialConfig);
        }
      });

    if (!isSourceProps()) {
      addListener('save-config', handleSaveConfig);

      return () => {
        removeListener('save-config', handleSaveConfig);
      };
    }

    const handleStorageEvent = createHandleStorageEvent(currentSource);

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [initialized]);

  return config;
}
