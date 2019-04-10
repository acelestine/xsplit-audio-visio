import * as React from 'react';

import Slider from '../../../../components/Slider';

const { useState } = React;

function CustomSlider(props: any) {
  const {
    classes,
    onUpdate,
    id,
    range,
    label,
    value: initialValue,
    default: defaultValue,
  } = props;
  const [minValue, maxValue] = range;
  const [value, setValue] = useState(initialValue || defaultValue);

  function handleChange(value: any) {
    setValue(value);
  }

  return (
    <div key={id}>
      <label className={classes.label}>{label}</label>
      <Slider
        value={value}
        maxValue={maxValue}
        onChange={handleChange}
        onUpdate={onUpdate}
        knob
      />
    </div>
  );
}

export default CustomSlider;
