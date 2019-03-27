import * as React from 'react';
import xjs from 'xjs-framework/dist/xjs-es2015';

import useConfig from '../../hooks/useConfig';
import usePluginInit from '../../hooks/usePluginInit';

const { useState, useEffect } = React;

const SourcePlugin = () => {
  const [item, setItem] = useState(null);
  const config = useConfig((obj: any) => {
    const event = new CustomEvent('props-change', { detail: obj });
    document.dispatchEvent(event);

    if (item) {
      (item as any).saveConfig(obj);
    }
  });

  usePluginInit(config || {});

  useEffect(() => {
    window.GetPlayState = () => {};

    xjs.Source.getCurrentSource().then((currentItem: any) => {
      setItem(currentItem);
      currentItem.setBrowserCustomSize(
        xjs.Rectangle.fromDimensions(1920, 1080)
      );
      currentItem.setMute(true);
    });
  }, []);

  return <canvas id="canvas" width={1920} height={1080} />;
};

export default SourcePlugin;
