import * as React from 'react';
import withStyles from 'react-jss';
import xjs from 'xjs-framework/dist/xjs-es2015';

import { Card, H5, Colors } from '@blueprintjs/core';

import AudioSelect from './AudioSelect';

import 'normalize.css/normalize.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';

interface Props {
  classes: any;
}

const styles = (theme: any) => ({
  '@global': {
    body: {
      background: theme.backgroundColor,
    },
  },
  container: {
    color: Colors.LIGHT_GRAY1,
    padding: [30, 5, 5],
    '& .bp3-heading': {
      color: Colors.LIGHT_GRAY5,
    },
  },
  card: {
    background: theme.backgroundColor,
    boxShadow: `0 0 0 1px ${theme.borderColor}, 0 0 0 ${
      theme.borderColor
    }, 0 0 0 ${theme.borderColor}`,
  },
});

const { useState, useEffect } = React;

const Configuration = ({ classes }: Props) => {
  const [initialized, setInitialize] = useState(false);

  useEffect(() => {
    if (initialized) {
      return;
    }

    if (window.external.isXsplitShell) {
      const propsWindow = xjs.SourcePropsWindow.getInstance();

      propsWindow.useTabbedWindow({
        customTabs: ['Custom'],
        tabOrder: ['Custom', 'Layout', 'Color', 'Transition'],
      });
    }

    setInitialize(true);
  });

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <H5>General</H5>
        <AudioSelect />
      </Card>
    </div>
  );
};

export default withStyles(styles)(Configuration);
