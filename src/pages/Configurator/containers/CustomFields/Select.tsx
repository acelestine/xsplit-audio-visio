import * as React from 'react';

import Select from '../../../../components/Select';
import Option from '../../../../components/Select/Option';

function CustomSelect(props: any) {
  const { options, id, label, classes } = props;

  return (
    <div key={id}>
      <label className={classes.label}>{label}</label>
      <Select>
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
