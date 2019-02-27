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
  ],
};
