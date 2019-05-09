export interface AudioDevice {
  value: string;
  label: string;
  deviceId: string;
}

export async function enumerate(): Promise<AudioDevice[]> {
  const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
  const audioOutputs = devices
    .filter((device: MediaDeviceInfo) => {
      const isXBCInput = device.label === 'XSplitBroadcaster (DirectShow)';
      const isNotDirectShow = device.label.indexOf('(DirectShow)') === -1;
      const isValidLabel =
        device.label !== '' && (isXBCInput || isNotDirectShow);
      console.log(device);
      return (
        device.kind === 'audioinput' &&
        isValidLabel &&
        device.deviceId !== 'communications'
      );
    })
    .map((device: MediaDeviceInfo) => {
      let label = device.label;

      if (device.label === 'XSplitBroadcaster (DirectShow)') {
        label = 'XBC Audio Devices';
      } else if (device.deviceId === 'default') {
        label = `Windows Default Microphone`;
      }

      return {
        value: `${device.kind}::${device.label}`,
        deviceId: device.deviceId,
        label,
      };
    })
    .sort((left, right) => {
      if (left.label === 'XBC Audio Devices') return -1;

      return left.label > right.label ? 1 : -1;
    });

  return audioOutputs;
}
