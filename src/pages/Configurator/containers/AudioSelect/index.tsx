import * as React from 'react';
import withStyles from 'react-jss';

import { requestSaveConfig } from '../../../../helpers/coms';
import { getIdentifier } from '../../../../helpers/identifier';

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
    getIdentifier().then((identifier: string) => {
      localStorage.setItem(
        'xsplit-plugin-event',
        JSON.stringify({
          id: identifier,
          value: Date.now(),
          type: 'get-audio-devices',
        })
      );
    });

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  useEffect(() => {
    setSelectedItem(value || defaultDevice);
  }, [value]);

  async function handleStorageEvent({ newValue, key }: StorageEvent) {
    if (key !== 'xsplit-plugin-event') {
      return; // Do nothing
    }

    try {
      const data = JSON.parse(newValue as string);

      const identifier = await getIdentifier();

      if (data.id !== identifier || data.type !== 'audio-devices') {
        return;
      }

      // Get device Id of XSplitBroadcaster... which is now "Default"
      const xsplitDevice = data.value.find((device: any) => {
        return device.label === 'Default';
      }) || { value: 'default' };

      setItems(data.value);
      setSelectedItem(value || xsplitDevice.value);
      setDefaultDevice(xsplitDevice.value);
    } catch (error) {
      // Do nothing
    }
  }

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
