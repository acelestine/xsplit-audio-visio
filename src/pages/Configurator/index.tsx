import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'react-jss';
import xjs from 'xjs-framework/dist/xjs-es2015';
import Loader from 'react-loader-spinner';
import cx from 'classnames';

import useConfig from '../../hooks/useConfig';

import Section from '../../components/Section';
import AudioSelect from './containers/AudioSelect';
import VisualizationSelect from './containers/VisualizationSelect';
import CustomFields from './containers/CustomFields';

interface Props {
  classes: any;
  visualization: string;
  isLoading: boolean;
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
  loading: {
    alignItems: 'center',
    background: 'rgba(0,0,0,0.5)',
    bottom: 0,
    display: 'none',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 999,

    '&$show': {
      display: 'flex',
    },
  },
  show: {},
});

const { useEffect } = React;

const Configuration = ({ classes, isLoading }: Props) => {
  const config = useConfig();
  const { audio, visualization } = (config || {}) as any;

  useEffect(() => {
    if (window.external.isXsplitShell) {
      const propsWindow = xjs.SourcePropsWindow.getInstance();

      propsWindow.useTabbedWindow({
        customTabs: ['Custom'],
        tabOrder: ['Custom', 'Layout', 'Color', 'Transition'],
      });
    }
  }, []);

  return (
    <div className={classes.container}>
      <div className={cx(classes.loading, { [classes.show]: isLoading })}>
        <Loader type="Puff" color="#00BFFF" height={40} width={40} />
      </div>

      <Section label="General" contentClassName={classes.sectionContents}>
        <AudioSelect value={audio} />
        <VisualizationSelect value={visualization} />
      </Section>
      {config && <CustomFields config={config} />}
    </div>
  );
};

const mapState = ({ visualizations: { selected, isLoading } }: any) => ({
  visualization: selected,
  isLoading,
});

export default compose(
  connect(mapState),
  withStyles(styles)
)(Configuration);
