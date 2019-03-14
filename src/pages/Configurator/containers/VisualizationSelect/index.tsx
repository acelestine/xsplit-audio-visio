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
  value: string;
  initializeList: () => void;
  select: (visualizer: string) => void;
  update: (key: string, value: any) => void;
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
const { useEffect } = React;

function VisualizationSelect({
  classes,
  list,
  selected,
  initializeList,
  select,
  update,
  value,
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
  visualizations: { initializeList, select, update },
}: any) => ({
  initializeList,
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
