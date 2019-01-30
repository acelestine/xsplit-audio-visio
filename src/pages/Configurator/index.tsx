import * as React from 'react';
import xjs from 'xjs-framework/dist/xjs-es2015';

const { useState, useEffect } = React;

const Configuration = () => {
  const [initialized, setInitialize] = useState(false);

  useEffect(() => {
    if (initialized === false) {
      const propsWindow = xjs.SourcePropsWindow.getInstance();

      propsWindow.useTabbedWindow({
        customTabs: ['Custom'],
        tabOrder: ['Custom', 'Layout', 'Color', 'Transition'],
      });

      setInitialize(true);
    }
  });

  return <div>I'm the config window</div>;
};

export default Configuration;
