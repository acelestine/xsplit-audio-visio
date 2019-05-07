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
  const [selectedItem, setSelectedItem] = useState(value);
  const [defaultDevice, setDefaultDevice] = useState('');

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices: MediaDeviceInfo[]) => {
        const audioOutputs = devices
          .filter((device: MediaDeviceInfo) => {
            const isXBCInput =
              device.label === 'XSplitBroadcaster (DirectShow)';
            const isNotDirectShow = device.label.indexOf('(DirectShow)') === -1;
            const isValidLabel =
              device.label !== '' && (isXBCInput || isNotDirectShow);

            return (
              // device.deviceId === 'default' || // We'll include default devices, both audiooutput and audioinput
              (device.kind === 'audioinput' && isValidLabel)
            );
          })
          .map((device: MediaDeviceInfo) => {
            let label = device.label;

            if (device.label === 'XSplitBroadcaster (DirectShow)') {
              label = 'Default';
            } else if (device.deviceId === 'default') {
              const type =
                device.kind === 'audioinput' ? 'Microphone' : 'Speaker';
              label = `Default ${type}`;
            }

            return {
              value: device.deviceId,
              label,
            };
          })
          .sort((left, right) => {
            if (left.label === 'Default') return -1;

            return left.label > right.label ? 1 : -1;
          });

        // Get device Id of XSplitBroadcaster... which is now "Default"
        const xsplitDevice = audioOutputs.find((device: any) => {
          return device.label === 'Default';
        }) || { value: 'default' };

        setItems(audioOutputs);
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
