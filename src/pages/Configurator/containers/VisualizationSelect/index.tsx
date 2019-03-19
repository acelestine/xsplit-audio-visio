import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'react-jss';
import Loader from 'react-loader-spinner';

import Select from '../../../../components/Select';
import Option from '../../../../components/Select/Option';
import OptionText from '../../../../components/Select/OptionText';

import { Visualization } from './interfaces';

interface Props {
  list: Visualization[];
  selected: string;
  classes: any;
  value: string;
  isLoading: boolean;
  initializeList: () => void;
  addVisualization: (url: string) => void;
  select: (visualizer: string) => void;
  update: (key: string, value: any) => void;
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  label: {
    paddingRight: '2.8em',
  },
  loading: {
    background: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    zIndex: 9,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
const { useEffect } = React;

function VisualizationSelect({
  classes,
  list,
  selected,
  initializeList,
  addVisualization,
  select,
  update,
  value,
  isLoading = false,
}: Props) {
  useEffect(() => {
    initializeList();
    value && update('selected', value);
  }, []);

  function handleChange(
    event: React.FormEvent<HTMLSelectElement>,
    value: string
  ) {
    select(value);
  }

  function handleAdd(url: string) {
    // @TODO:
    // dispatch action that would get manifest file
    // and then IF manifest file exists and is valid
    // add it to the list :D
    // and then call select action
    addVisualization(url);
  }

  return (
    <div className={classes.container}>
      <label className={classes.label}>Visualizer</label>
      <Select value={selected} onSelect={handleChange}>
        {isLoading ? (
          <div className={classes.loading}>
            <Loader type="Puff" color="#00BFFF" height={40} width={40} />
          </div>
        ) : (
          <div />
        )}
        {list.map(item => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
        <OptionText onUpdate={handleAdd}>Add Custom...</OptionText>
      </Select>
    </div>
  );
}

const mapState = ({ visualizations: { selected, list, isLoading } }: any) => ({
  selected,
  list,
  isLoading,
});

const mapDispatch = ({
  visualizations: { initializeList, addVisualization, select, update },
}: any) => ({
  initializeList,
  addVisualization,
  select,
  update,
});

export default compose<any>(
  connect(
    mapState,
    mapDispatch
  ),
  withStyles(styles)
)(VisualizationSelect);
