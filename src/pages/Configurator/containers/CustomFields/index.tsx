import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'react-jss';
import omit from 'lodash/omit';

import store from '../../../../store';
import { requestSaveConfig } from '../../../../helpers/coms';

import Section from '../../../../components/Section';
import Slider from '../../../../components/Slider';
import Select from '../../../../components/Select';
import Option from '../../../../components/Select/Option';

import { Visualization } from '../VisualizationSelect/interfaces';

interface Props {
  classes: any;
  visualization: Visualization;
  config: any;
}

const styles = {
  label: {
    paddingRight: '1em',
  },
};

class CustomFields extends React.Component<Props> {
  static defaultProps = {
    config: {},
  };

  visualizers: any;

  state = { ...this.props.config } as any;

  componentDidMount() {
    this.visualizers = require('../../../../visualizers');
  }

  handleChange = (id: string) => (value: any) => {
    this.setState({ [id]: value });
    requestSaveConfig({ [id]: value });
  };

  renderSelect(attributes: any) {
    const { classes } = this.props;
    const { options, id, label } = attributes;

    return (
      <div key={id}>
        <label className={classes.label}>{label}</label>
        <Select>
          {options.map((option: any) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
    );
  }

  renderSlider(attributes: any) {
    const { classes } = this.props;
    const { id, range, label, default: defaultValue } = attributes;
    const [minValue, maxValue] = range;

    // @TODO: We don't use minValue for now...

    return (
      <div key={id}>
        <label className={classes.label}>{label}</label>
        <Slider
          value={this.state[id] || defaultValue}
          maxValue={maxValue}
          onChange={this.handleChange(id)}
          knob
        />
      </div>
    );
  }

  render() {
    const { visualization } = this.props;

    if (
      visualization &&
      this.visualizers &&
      this.visualizers[visualization.label]
    ) {
      const { fields } = this.visualizers[visualization.label];

      // @TODO: Figure out how to pre-populate the fields with value if ever user already had some saved in the config
      return (
        <Section label="Visualization Settings">
          {fields.map((field: any) => {
            switch (field.type) {
              case 'slider':
                return this.renderSlider(omit(field, ['type']));

              case 'select':
                return this.renderSelect(omit(field, ['type']));
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

export default compose(
  connect(mapState),
  withStyles(styles)
)(CustomFields);
