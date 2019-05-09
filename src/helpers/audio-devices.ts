export interface AudioDevice {
  value: string;
  label: string;
}

export async function enumerate(): Promise<AudioDevice[]> {
  const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
  const audioOutputs = devices
    .filter((device: MediaDeviceInfo) => {
      const isXBCInput = device.label === 'XSplitBroadcaster (DirectShow)';
      const isNotDirectShow = device.label.indexOf('(DirectShow)') === -1;
      const isValidLabel =
        device.label !== '' && (isXBCInput || isNotDirectShow);

      return (
        device.kind === 'audioinput' &&
        isValidLabel &&
        device.deviceId !== 'communications'
      );
    })
    .map((device: MediaDeviceInfo) => {
      let label = device.label;

      if (device.label === 'XSplitBroadcaster (DirectShow)') {
        label = 'Default';
      } else if (device.deviceId === 'default') {
        const type = device.kind === 'audioinput' ? 'Microphone' : 'Speaker';
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

  return audioOutputs;
}
