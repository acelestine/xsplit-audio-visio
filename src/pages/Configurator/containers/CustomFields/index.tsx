import * as React from 'react';
import { connect } from 'react-redux';

import store from '../../../../store';

import Slider from '../../../../components/Slider';

import { Visualization } from '../VisualizationSelect/interfaces';

interface Props {
  visualization: Visualization;
}

class CustomFields extends React.Component<Props> {
  render() {
    const { visualization } = this.props;

    // TESTING!
    const visualizers = require('../../../../visualizers');
    console.log(visualization && visualizers[visualization.label]);

    return <div />;
  }
}

const visualizationSelector = store.select(models => ({
  visualization: models.visualizations.getVisualizer,
}));

const mapState = (state: any, props: any) => ({
  ...visualizationSelector(state, props),
});

export default connect(mapState)(CustomFields);
