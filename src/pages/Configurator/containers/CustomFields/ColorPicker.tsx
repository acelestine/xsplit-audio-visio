import * as React from 'react';
import { BlockPicker, ColorResult } from 'react-color';
import withStyles from 'react-jss';

interface Props {
  classes: any;
  label: string;
  value: string;
  onUpdate: (hex: string) => void;
}

const styles = {
  container: {
    alignItems: 'center',
    display: 'flex',
    position: 'relative',
  },
  swatch: {
    padding: 5,
    background: '#131313',
    borderRadius: 1,
    boxShadow: [0, 0, 0, 1, 'rgba(0,0,0,.1)'],
    display: 'inline-block',
    cursor: 'pointer',
  },
  color: {
    width: 36,
    height: 14,
    borderRadius: 2,
  },
  popover: {
    position: 'absolute',
    zIndex: 2,
    top: 24,
  },
  cover: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  label: {
    paddingRight: '1em',
  },
};

const { useState, useEffect } = React;

function ColorPicker({ classes, label, value = '#FF3D40', onUpdate }: any) {
  const [isColorPickerVisible, setColorPickerVisibility] = useState(false);
  const [color, setColor] = useState(value);

  useEffect(() => {
    setColor(value);
  }, [value]);

  function handleClick() {
    setColorPickerVisibility(!isColorPickerVisible);
  }

  function handleCloseClick() {
    setColorPickerVisibility(false);
  }

  function handleColorChange(color: ColorResult) {
    if (onUpdate) {
      onUpdate(color.hex);
    }

    setColor(color.hex);
  }

  return (
    <div className={classes.container}>
      <label className={classes.label}>{label}</label>
      <div className={classes.swatch} onClick={handleClick}>
        <div className={classes.color} style={{ background: color }} />
      </div>

      {isColorPickerVisible ? (
        <div className={classes.popover}>
          <div className={classes.cover} onClick={handleCloseClick} />
          <BlockPicker
            color={color}
            onChange={handleColorChange}
            triangle="hide"
          />
        </div>
      ) : null}
    </div>
  );
}

export default withStyles(styles)(ColorPicker);
