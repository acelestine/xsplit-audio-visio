// This component was copy-pasted from xsplit-react-components

import * as React from 'react';
import withStyles from 'react-jss';
import cx from 'classnames';
import pick from 'lodash/pick';

interface Props {
  classes: any;
  value: number;
  maxValue: number;
  width?: string | number;
  round?: boolean;
  knob?: boolean;
  disabled?: boolean;
  onChange?: any;
}

const styles = (theme: any) => ({
  container: {
    backgroundColor: theme.sliderBackgroundColor,
    display: 'inline-block',
    width: 200,
    height: 6,
    cursor: 'pointer',
  },
  disabled: {
    cursor: 'default',
    pointerEvents: 'none',
    opacity: 0.8,
  },
  slider: {
    height: '100%',
    display: 'inline-block',
    backgroundColor: theme.sliderMainColor,
    width: '100%',
    position: 'absolute',
    zIndex: 0,
  },
  knob: {
    display: 'none',
    height: 10,
    position: 'absolute',
    top: -2,
    zIndex: 1,
  },
});

class Slider extends React.Component<Props> {
  static defaultProps = {
    value: 0,
    maxValue: 100,
    width: 200,
    round: true,
    knob: false,
    disabled: false,
  };

  container: any = React.createRef();
  slider: any = React.createRef();
  limit: any = React.createRef();
  knob: any = React.createRef();

  mouseDown: boolean = false;

  componentDidMount() {
    window.addEventListener('mouseup', this.handleMouseUp, false);
    window.addEventListener('mousemove', this.handleMouseMove, false);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.handleMouseUp, false);
    window.removeEventListener('mousemove', this.handleMouseMove, false);
  }

  computeLimit = () => {
    const { maxValue } = this.props;
    const pRect = this.container.getBoundingClientRect();

    // We directly set the styles and not save it to state to prevent re-renders
    if (maxValue > 100) {
      this.limit.style.maxWidth = (100 / maxValue) * pRect.width + 'px';
      return;
    }

    this.limit.style.maxWidth = 'unset';
  };

  setWidth = () => {
    const { value, maxValue } = this.props;
    const pRect = this.container.getBoundingClientRect();

    // We directly set the styles and not save it to state to prevent re-renders
    this.slider.style.width = (value / maxValue) * pRect.width + 'px';
  };

  changeValue = (value: number) => {
    if (value === this.props.value) {
      return;
    }

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  handleMouseUp = (event: any) => (this.mouseDown = false);

  handleMouseDown = (event: React.MouseEvent) => {
    event.persist();
    this.mouseDown = true;
    this.handleMouseMove(event);
  };

  handleMouseMove = (event: any) => {
    if (!this.mouseDown || this.container === null) {
      return;
    }

    const maxValue = this.props.maxValue;
    const pRect = (this.container as HTMLDivElement).getBoundingClientRect();
    let left = event.clientX - pRect.left;

    left = left > pRect.width ? pRect.width : left;
    left = left < 0 ? 0 : left;

    this.changeValue((left / pRect.width) * maxValue);
  };

  render() {
    const { classes, disabled, knob, round, maxValue, value } = this.props;
    const containerStyle = pick(this.props, ['minWidth', 'maxWidth', 'width']);
    const containerClass = cx(classes.container, {
      [classes.disabled]: disabled,
      [classes.knob]: knob,
      [classes.round]: round,
      [classes.square]: !round,
      [classes.exceed]: maxValue > 100,
      [classes.maxed]: value >= maxValue,
    });

    return (
      <div
        ref={this.container}
        style={containerStyle}
        className={containerClass}
        onMouseDown={this.handleMouseDown}
      >
        <div ref={this.slider} className={classes.slider}>
          <div ref={this.limit} className={classes.limit} />
          <div ref={this.knob} className={classes.knob} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Slider);
