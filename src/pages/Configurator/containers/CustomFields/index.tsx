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
    minWidth: 76,
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

  state = {
    config: this.props.config,
    visualization: this.props.visualization,
  } as any;

  static getDerivedStateFromProps(props: any, state: any) {
    if (props.visualization !== state.visualization) {
      return props;
    }

    return state;
  }

  componentDidMount() {
    this.visualizers = require('../../../../visualizers');
  }

  handleUpdate = (id: string) => (value: any) => {
    this.setState({ config: { ...this.state.config, [id]: value } }, () =>
      requestSaveConfig({ ...this.state.config, [id]: value })
    );
  };

  render() {
    const { visualization, classes } = this.props;
    const { config } = this.state; // Prevent re-updating the configs if need be po.

    if (
      visualization &&
      this.visualizers &&
      this.visualizers[visualization.label]
    ) {
      const { fields } = this.visualizers[visualization.label];

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
                    value={
                      config[field.id] === undefined
                        ? field.default
                        : config[field.id]
                    }
                  />
                );

              case 'select':
                return (
                  <Select
                    {...omit(field, ['type'])}
                    classes={classes}
                    onChange={this.handleUpdate(field.id)}
                    key={`${field.type}-${index}`}
                    value={
                      config[field.id] === undefined
                        ? field.default
                        : config[field.id]
                    }
                  />
                );

              case 'colorpicker':
                return (
                  <ColorPicker
                    {...omit(field, ['type'])}
                    classes={classes}
                    onUpdate={this.handleUpdate(field.id)}
                    key={`${field.type}-${index}`}
                    value={
                      config[field.id] === undefined
                        ? field.default
                        : config[field.id]
                    }
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

export default compose<any>(
  connect(mapState),
  withStyles(styles)
)(CustomFields);
