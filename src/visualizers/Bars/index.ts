export default {
  name: 'Bars',
  id: 'bars',
  fields: [
    {
      id: 'sensitivity',
      label: 'Sensitivity',
      type: 'slider',
      range: [1, 99],
      default: 50,
      step: 1,
      tooltip:
        'Increasing this value will make<br> the visualizer respond to quieter sounds <br>and make the graph bigger.',
    },
    {
      id: 'color',
      label: 'Color',
      type: 'colorpicker',
      default: '#F47373',
      tooltip: 'Select the color of the visualizer',
    },
    {
      id: 'bars',
      label: 'Bars Count',
      type: 'select',
      options: [
        { value: 8, label: 8 },
        { value: 16, label: 16 },
        { value: 32, label: 32 },
        { value: 64, label: 64 },
      ],
      default: 8,
      step: 1,
      tooltip: 'Specify the number of bars that the plugin would render',
    },
  ],
};
