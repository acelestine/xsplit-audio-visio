import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'react-jss';
import omit from 'lodash/omit';

import store from '../../../../store';
import { requestSaveConfig } from '../../../../helpers/coms';

import Section from '../../../../components/Section';

import Select from './Select';
import Slider from './Slider';
import ColorPicker from './ColorPicker';

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
  sectionContents: {
    '& > div > div:not(:last-of-type)': {
      marginBottom: '1em',
    },
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

  handleUpdate = (id: string) => (value: any) => {
    requestSaveConfig({ [id]: value });
  };

  render() {
    const { visualization, classes } = this.props;

    if (
      visualization &&
      this.visualizers &&
      this.visualizers[visualization.label]
    ) {
      const { fields } = this.visualizers[visualization.label];

      // @TODO: Figure out how to pre-populate the fields with value if ever user already had some saved in the config
      return (
        <Section
          label="Visualization Settings"
          contentClassName={classes.sectionContents}
        >
          {fields.map((field: any, index: number) => {
            switch (field.type) {
              case 'slider':
                return (
                  <Slider
                    {...omit(field, ['type'])}
                    classes={classes}
                    onUpdate={this.handleUpdate(field.id)}
                    key={`${field.type}-${index}`}
                  />
                );

              case 'select':
                return (
                  <Select
                    {...omit(field, ['type'])}
                    classes={classes}
                    key={`${field.type}-${index}`}
                  />
                );

              case 'colorpicker':
                return (
                  <ColorPicker
                    {...omit(field, ['type'])}
                    classes={classes}
                    onUpdate={this.handleUpdate(field.id)}
                    key={`${field.type}-${index}`}
                  />
                );
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
