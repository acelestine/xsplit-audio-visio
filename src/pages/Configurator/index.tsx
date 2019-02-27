import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'react-jss';
import xjs from 'xjs-framework/dist/xjs-es2015';

import useConfig from '../../hooks/useConfig';

import Section from '../../components/Section';
import AudioSelect from './containers/AudioSelect';
import VisualizationSelect from './containers/VisualizationSelect';
import CustomFields from './containers/CustomFields';

interface Props {
  classes: any;
  visualization: string;
}

const styles = (theme: any) => ({
  '@global': {
    body: {
      background: theme.backgroundColor,
      fontSize: 12,
      userSelect: 'none',
    },
    label: { color: theme.labelColor },
  },
  sectionContents: {
    '& > div > div:not(:last-of-type)': {
      marginBottom: '1em',
    },
  },
});

const { useState, useEffect } = React;

const Configuration = ({ classes }: Props) => {
  const [initialized, setInitialize] = useState(false);
  const config = useConfig();
  const { audio } = (config || {}) as any;

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
      <Section label="General" contentClassName={classes.sectionContents}>
        <AudioSelect value={audio} />
        <VisualizationSelect />
      </Section>
      {config && <CustomFields config={config} />}
    </div>
  );
};

const mapState = ({ visualizations: { selected } }: any) => ({
  visualization: selected,
});

export default compose(
  connect(mapState),
  withStyles(styles)
)(Configuration);
