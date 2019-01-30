import * as React from 'react';
// import xjs from 'xjs-framework/dist/xjs-es2015';

const { useState, useEffect } = React;

const SourcePlugin = () => {
  const [initialized, setInitialize] = useState(false);

  useEffect(() => {
    if (initialized === false) {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'xsplit:config-url');
      meta.setAttribute('content', location.origin);
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
