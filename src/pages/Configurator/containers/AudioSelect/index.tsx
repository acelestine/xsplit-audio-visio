import * as React from 'react';
import withStyles from 'react-jss';

import { requestSaveConfig } from '../../../../helpers/coms';
import { getIdentifier } from '../../../../helpers/identifier';
import * as audioDevices from '../../../../helpers/audio-devices';

import Select from '../../../../components/Select';
import Option from '../../../../components/Select/Option';

interface AudioOutput {
  value: string;
  label: string;
}

interface Props {
  classes: any;
  value: string | undefined;
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    paddingRight: '1em',
  },
};
const { useState, useEffect } = React;

function AudioSelect({ classes, value }: Props) {
  const [items, setItems] = useState(([] as unknown) as AudioOutput[]);
  const [selectedItem, setSelectedItem] = useState(value);
  const [defaultDevice, setDefaultDevice] = useState('');

  useEffect(() => {
    audioDevices.enumerate().then((devices: audioDevices.AudioDevice[]) => {
      // Get device Id of XSplitBroadcaster... which is now "Default"
      const xsplitDevice = devices.find((device: any) => {
        return device.label === 'XBC Audio Devices';
      }) || { value: 'default' };

      console.log(devices);

      setItems(devices);
      setSelectedItem(value || xsplitDevice.value);
      setDefaultDevice(xsplitDevice.value);
    });
  }, []);

  useEffect(() => {
    setSelectedItem(value || defaultDevice);
  }, [value]);

  function handleChange(
    event: React.FormEvent<HTMLSelectElement>,
    value: string
  ) {
    event.preventDefault();
    setSelectedItem(value);
    requestSaveConfig({ audio: value });
  }

  return (
    <div className={classes.container}>
      <label className={classes.label}>Audio Source</label>
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

export default withStyles(styles)(AudioSelect);
