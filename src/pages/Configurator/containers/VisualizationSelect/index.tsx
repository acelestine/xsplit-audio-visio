import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'react-jss';

import Select from '../../../../components/Select';
import Option from '../../../../components/Select/Option';

import { Visualization } from './interfaces';

interface Props {
  list: Visualization[];
  selected: string;
  classes: any;
  initializeList: () => void;
  selectVisualizer: (visualizer: string) => void;
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    paddingRight: '2.8em',
  },
};
const { useState, useEffect } = React;

function VisualizationSelect({
  classes,
  list,
  selected,
  initializeList,
  selectVisualizer,
}: Props) {
  const [isInitialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      initializeList();
      setInitialized(true);
    }
  });

  function handleChange(
    event: React.FormEvent<HTMLSelectElement>,
    value: string
  ) {
    selectVisualizer(value);
  }

  return (
    <div className={classes.container}>
      <label className={classes.label}>Visualizer</label>
      <Select value={selected} onSelect={handleChange}>
        {list.map(item => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}

const mapState = ({ visualizations: { selected, list } }: any) => ({
  selected,
  list,
});

const mapDispatch = ({
  visualizations: { initializeList, selectVisualizer },
}: any) => ({
  initializeList,
  selectVisualizer,
});

export default compose(
  connect(
    mapState,
    mapDispatch
  ),
  withStyles(styles)
)(VisualizationSelect);
