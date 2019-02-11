import * as React from 'react';
// import { FormGroup, HTMLSelect, IOptionProps } from '@blueprintjs/core';

const { useState, useEffect } = React;

function AudioSelect() {
  const [isInitialized, setInitialized] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    if (!isInitialized) {
      // @TODO: Confirm with @miyb if we would only want to capture audio output devices (ie. sounds from the PC)
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices: MediaDeviceInfo[]) => {
          const audioOutputs = devices
            .filter((device: MediaDeviceInfo) => device.kind === 'audiooutput')
            .map((device: MediaDeviceInfo) => ({
              value: device.deviceId,
              label: device.label.replace(' (DirectShow)', ''),
            }));

          setInitialized(true);
        });
    }
  });

  function handleChange(event: React.FormEvent<HTMLSelectElement>) {
    setSelectedItem(event.currentTarget.value);
  }

  return <div />;
}

export default AudioSelect;
