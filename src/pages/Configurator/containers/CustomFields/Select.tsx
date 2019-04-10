import * as React from 'react';

import Select from '../../../../components/Select';
import Option from '../../../../components/Select/Option';

const { useState } = React;

function CustomSelect(props: any) {
  const { options, id, label, classes, value: initialValue } = props;
  const [value, setValue] = useState(initialValue);

  return (
    <div key={id}>
      <label className={classes.label}>{label}</label>
      <Select value={value}>
        {options.map((option: any) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default CustomSelect;
