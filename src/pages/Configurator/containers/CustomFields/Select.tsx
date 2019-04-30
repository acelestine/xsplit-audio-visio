import * as React from 'react';
import withStyles from 'react-jss';

import Select from '../../../../components/Select';
import Option from '../../../../components/Select/Option';

const { useState } = React;

const styles = {
  container: {
    alignItems: 'center',
    display: 'flex',
    position: 'relative',
  },
};

function CustomSelect(props: any) {
  const { options, id, label, classes, value: initialValue, onChange } = props;
  const [value, setValue] = useState(initialValue);

  function handleOnSelect(
    event: React.FormEvent<HTMLSelectElement>,
    value: string
  ) {
    event.preventDefault();
    setValue(Number(value));
    onChange(Number(value));
  }

  return (
    <div key={id} className={classes.container}>
      <label className={classes.label}>{label}</label>
      <Select value={value} onSelect={handleOnSelect}>
        {options.map((option: any) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default withStyles(styles)(CustomSelect);
