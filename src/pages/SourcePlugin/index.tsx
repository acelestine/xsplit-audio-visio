import * as React from 'react';

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

  useEffect(() => {
    if (initialized === false) {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'xsplit:config-url');
      meta.setAttribute('content', getMetaContent());
      document.head.appendChild(meta);

      setInitialize(true);
    }
  });

  return (
    <div style={{ background: 'black', color: 'white' }}>
      I'm an html plugin!
    </div>
  );
};

export default SourcePlugin;
