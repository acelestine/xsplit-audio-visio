import * as React from 'react';
import withStyles from 'react-jss';

import { requestSaveConfig } from '../../../../helpers/coms';

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
  const [selectedItem, setSelectedItem] = useState(value || 'default');

  useEffect(() => {
    // @TODO: Confirm with @miyb if we would only want to capture audio output devices (ie. sounds from the PC)
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices: MediaDeviceInfo[]) => {
        const audioOutputs = devices
          .filter(
            (device: MediaDeviceInfo) =>
              device.kind === 'audioinput' &&
              (device.label !== '' || device.deviceId !== 'default')
          )
          .map((device: MediaDeviceInfo) => ({
            value: device.deviceId,
            label:
              device.label === 'XSplitBroadcaster (DirectShow)'
                ? 'Default'
                : device.label.replace(' (DirectShow)', ''),
          }))
          .sort((left, right) => {
            if (left.label === 'Default') return -1;

            return left.label > right.label ? 1 : -1;
          });

        // Get device Id of XSplitBroadcaster... which is now "Default"
        const defaultDevice = audioOutputs.find(
          (device: any) => device.label === 'Default'
        ) || { value: 'default' };

        setItems(audioOutputs);
        setSelectedItem(value || defaultDevice.value);
      });
  }, []);

  useEffect(() => {
    setSelectedItem(value || 'default');
  }, [value]);

  function handleChange(
    event: React.FormEvent<HTMLSelectElement>,
    value: string
  ) {
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
