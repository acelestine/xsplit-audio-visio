import * as React from 'react';
import withStyles from 'react-jss';
import xjs from 'xjs-framework/dist/xjs-es2015';

import Section from '../../components/Section';
import Select from '../../components/Select';
import Option from '../../components/Select/Option';

// import AudioSelect from './AudioSelect';

interface Props {
  classes: any;
}

const styles = (theme: any) => ({
  '@global': {
    body: {
      background: theme.backgroundColor,
    },
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
      <Section label="General">
        <Select value="tester">
          <Option value="tester">Testing</Option>
        </Select>
      </Section>
    </div>
  );
};

export default withStyles(styles)(Configuration);
