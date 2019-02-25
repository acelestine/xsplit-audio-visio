import * as React from 'react';

import useConfig from '../../hooks/useConfig';

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
  const [initialized, setInitialize] = useState(false);
  const config = useConfig();

  useEffect(() => {
    if (initialized === false) {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'xsplit:config-url');
      meta.setAttribute('content', getMetaContent());
      document.head.appendChild(meta);

      // @TODO: Move the ff. stuff to `effects` or maybe explore the possibility of using custom hooks
      window.GetPlayState = () => {};

      setInitialize(true);
    }
  });

  console.log(config);

  return <canvas id="canvas" width={1920} height={1080} />;
};

export default SourcePlugin;
