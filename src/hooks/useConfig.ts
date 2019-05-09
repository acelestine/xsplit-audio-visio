import * as React from 'react';
import xjs from 'xjs-framework/dist/xjs-es2015';

import { addListener, removeListener } from '../helpers/coms';
import { isSourceProps } from '../helpers/environment';
import { getIdentifier } from '../helpers/identifier';
import * as audioDevices from '../helpers/audio-devices';

const { isXsplitShell: IS_XSPLIT } = window.external;

const { useState, useEffect } = React;

export default function useConfig(callback?: Function) {
  const [config, setConfig] = useState(null as any);

  // This will only be used by the source plugin
  async function getDeviceId(ident: string): Promise<string> {
    const devices: audioDevices.AudioDevice[] = await audioDevices.enumerate();
    const targetDevice: audioDevices.AudioDevice | undefined = devices.find(
      (item: audioDevices.AudioDevice) => item.value === ident
    );

    if (!targetDevice) {
      console.error(
        `Audio device with ident: ${ident} does not exist in HTML Plugin instance`
      );
      return 'default';
    }

    return targetDevice.deviceId;
  }

  async function handleSaveConfig(newConfig: any) {
    const audio =
      newConfig.audio && newConfig.audio !== config.audio
        ? await getDeviceId(newConfig.audio)
        : 'default';

    setConfig({ ...newConfig, audio });

    const identifier = await getIdentifier();

    const obj: any = {
      id: identifier,
      value: Date.now(),
      type: 'config',
    };

    if (!IS_XSPLIT) {
      obj['config'] = newConfig;
    }

    localStorage.setItem('xsplit-plugin-event', JSON.stringify(obj));

    if (callback) {
      callback(newConfig);
    }
  }

  function createHandleStorageEvent(currentSource: any) {
    return ({ oldValue, newValue, key }: StorageEvent) => {
      if (key !== 'xsplit-plugin-event') {
        return; // Do nothing
      }

      try {
        // This shouldn't happen, storage should not get triggered if old and new are the same... but just in case...
        if (newValue === oldValue) {
          return;
        }

        const data = JSON.parse(newValue as string);

        getIdentifier().then(identifier => {
          if (data.id !== identifier || data.type !== 'config') {
            return;
          }

          if (IS_XSPLIT) {
            currentSource
              .then((source: any) => source.loadConfig())
              .then((initialConfig: any) => {
                setConfig(initialConfig);
              });
          } else {
            setConfig(data.config);
          }
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
        const computedConfig = initialConfig.visualizer
          ? initialConfig
          : {
              ...initialConfig,
              visualizer: 'bars',
              audio: '',
            };

        setConfig(computedConfig);

        if (callback) {
          callback(computedConfig);
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
  }, []);

  return config;
}
