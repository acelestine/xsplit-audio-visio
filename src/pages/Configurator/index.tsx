import * as React from 'react';
import xjs from 'xjs-framework/dist/xjs-es2015';

import Section from '../../components/Section';

const { useState, useEffect } = React;

const Configuration = () => {
  const [initialized, setInitialize] = useState(false);

  useEffect(() => {
    if (initialized) {
      return;
    }

    if (window.external.isXSplit) {
      const propsWindow = xjs.SourcePropsWindow.getInstance();

      propsWindow.useTabbedWindow({
        customTabs: ['Custom'],
        tabOrder: ['Custom', 'Layout', 'Color', 'Transition'],
      });
    }

    setInitialize(true);
  });

  return (
    <div>
      <Section label="General">Hello</Section>
      <Section label="Visualizer Settings">World</Section>
    </div>
  );
};

export default Configuration;
