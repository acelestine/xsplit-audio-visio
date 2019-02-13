import * as React from 'react';
import withStyles from 'react-jss';

import Select from '../../components/Select';
import Option from '../../components/Select/Option';

import * as visualizers from '../../visualizers';

interface VisualizerMetadata {
  name: string;
  id: string;
  fields: any;
}

interface Visualization {
  value: string;
  label: string;
}

interface Props {
  classes: any;
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

function VisualizationSelect({ classes }: Props) {
  const [isInitialized, setInitialized] = useState(false);
  const [items, setItems] = useState(([] as unknown) as Visualization[]);
  const [selectedItem, setSelectedItem] = useState('bars');

  useEffect(() => {
    if (!isInitialized) {
      const options = Object.keys(visualizers).map((item: string) => {
        const obj: VisualizerMetadata = (visualizers as any)[item];

        return { label: obj.name, value: obj.id };
      });
      setInitialized(true);
      setItems(options);
    }
  });

  function handleChange(
    event: React.FormEvent<HTMLSelectElement>,
    value: string
  ) {
    setSelectedItem(value);
  }

  return (
    <div className={classes.container}>
      <label className={classes.label}>Visualizer</label>
      <Select value={selectedItem} onSelect={handleChange}>
        {items.map(item => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default withStyles(styles)(VisualizationSelect);
