import * as React from 'react';
import xjs from 'xjs-framework/dist/xjs-es2015';

import useConfig from '../../hooks/useConfig';
import usePluginInit from '../../hooks/usePluginInit';

const { useState, useEffect } = React;

function getMetaContent() {
  if (location.origin !== 'file://') {
    return location.origin;
  }

  const captured = /.+\/([\w\W]+)\.(\w+)/gm.exec(location.href);

  if (captured) {
    const [fullPath, filename, extension] = captured;

    return `./${filename}.${extension}`;
  }

  return '';
}

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
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'xsplit:config-url');
    meta.setAttribute('content', getMetaContent());
    document.head.appendChild(meta);

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
