import * as React from 'react';
import { connect } from 'react-redux';
import omit from 'lodash/omit';

import store from '../../../../store';

import Section from '../../../../components/Section';
import Slider from '../../../../components/Slider';

import { Visualization } from '../VisualizationSelect/interfaces';

interface Props {
  visualization: Visualization;
}

class CustomFields extends React.Component<Props> {
  visualizers: any;

  componentDidMount() {
    this.visualizers = require('../../../../visualizers');
  }

  renderSlider(id: string, ...attributes: any) {
    return <Slider key={id} value={0} maxValue={100} knob />;
  }

  render() {
    const { visualization } = this.props;

    if (visualization && this.visualizers[visualization.label]) {
      const { fields } = this.visualizers[visualization.label];

      return (
        <Section label="Visualization Settings">
          {fields.map((field: any) => {
            switch (field.type) {
              case 'slider':
                return this.renderSlider(omit(field, 'type'));
            }
          })}
        </Section>
      );
    }

    return null;
  }
}

const visualizationSelector = store.select(models => ({
  visualization: models.visualizations.getVisualizer,
}));

const mapState = (state: any, props: any) => ({
  ...visualizationSelector(state, props),
});

export default connect(mapState)(CustomFields);
