import * as React from 'react';
import xjs from 'xjs-framework/dist/xjs-es2015';

import useConfig from '../../hooks/useConfig';
import usePluginInit from '../../hooks/usePluginInit';
import * as audioDevices from '../../helpers/audio-devices';
import { getIdentifier } from '../../helpers/identifier';

const { useState, useEffect } = React;

const SourcePlugin = () => {
  const [item, setItem] = useState(null);
  const config = useConfig();

  usePluginInit(config || {});

  useEffect(() => {
    window.GetPlayState = () => {};

    xjs.Source.getCurrentSource().then((currentSource: any) => {
      setItem(currentSource);
      currentSource.setBrowserCustomSize(
        xjs.Rectangle.fromDimensions(1920, 1080)
      );
      currentSource.setMute(true);
      currentSource.setName('Audio Visualizer');
    });

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  useEffect(() => {
    const event = new CustomEvent('props-change', { detail: config });

    document.dispatchEvent(event);

    if (item) {
      (item as any).saveConfig(config);
    }
  }, [config]);

  async function handleStorageEvent({ newValue, key }: StorageEvent) {
    if (key !== 'xsplit-plugin-event') {
      return; // Do nothing
    }

    try {
      const data = JSON.parse(newValue as string);

      const identifier = await getIdentifier();

      if (data.id !== identifier || data.type !== 'get-audio-devices') {
        return;
      }

      audioDevices
        .enumerate()
        .then(async (devices: audioDevices.AudioDevice[]) => {
          const identifier = await getIdentifier();
          const obj: any = {
            id: identifier,
            value: devices,
            type: 'audio-devices',
          };

          localStorage.setItem('xsplit-plugin-event', JSON.stringify(obj));
        });
    } catch (error) {
      // Do nothing
    }
  }

  return <canvas id="canvas" width={1920} height={1080} />;
};

export default SourcePlugin;
