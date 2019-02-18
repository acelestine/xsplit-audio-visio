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

interface State {
  value: number;
}

const styles = (theme: any) => ({
  container: {
    backgroundColor: theme.sliderBackgroundColor,
    display: 'inline-block',
    width: 200,
    height: 6,
    cursor: 'pointer',
    position: 'relative',
    '&$disabled': {
      cursor: 'default',
      pointerEvents: 'none',
      opacity: 0.8,
    },
    '&$isKnob': {
      '& > $slider $knob': {
        display: 'block',
        backgroundColor: theme.knobColor,
        right: -5,
      },
    },
  },
  round: {
    borderRadius: 10,

    '&$maxed $limit': {
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
    },

    '&$exceed': {
      '&$maxed $slider': {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      },

      '& $limit': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
    },

    '& $slider, & $limit': {
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
    },

    '& $knob': {
      width: 10,
      borderRadius: 10,
    },
  },
  square: {
    '& $knob': {
      right: -2,
      width: 2,
    },
  },
  slider: {
    height: '100%',
    display: 'block',
    backgroundColor: theme.sliderSubColor,
    position: 'relative',

    '& $limit': {
      height: '100%',
      display: 'inline-block',
      backgroundColor: theme.sliderMainColor,
      width: '100%',
      position: 'absolute',
      zIndex: 0,
    },
  },
  knob: {
    color: theme.knobColor,
    display: 'none',
    height: 10,
    position: 'absolute',
    top: -2,
    zIndex: 1,
  },
  disabled: {},
  isKnob: {},
  maxed: {},
  exceed: {},
  limit: {},
});

class Slider extends React.Component<Props, State> {
  static defaultProps = {
    value: 0,
    maxValue: 100,
    width: 200,
    round: true,
    knob: false,
    disabled: false,
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.onChange) {
      return {
        value: props.value,
      };
    }

    return { value: state.value };
  }

  container: any = React.createRef();
  slider: any = React.createRef();
  limit: any = React.createRef();
  knob: any = React.createRef();

  mouseDown: boolean = false;

  state = {
    value: this.props.value,
  };

  componentDidMount() {
    this.computeLimit();
    this.setWidth();

    window.addEventListener('mouseup', this.handleMouseUp, false);
    window.addEventListener('mousemove', this.handleMouseMove, false);
  }

  componentDidUpdate() {
    this.computeLimit();
    this.setWidth();
  }

  shouldComponentUpdate(nextProps: any) {
    if (!nextProps.knob) {
      return false;
    }

    return true;
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.handleMouseUp, false);
    window.removeEventListener('mousemove', this.handleMouseMove, false);
  }

  computeLimit = () => {
    const { maxValue } = this.props;
    const pRect = this.container.current.getBoundingClientRect();

    // We directly set the styles and not save it to state to prevent re-renders
    if (maxValue > 100) {
      this.limit.current.style.maxWidth = (100 / maxValue) * pRect.width + 'px';
      return;
    }

    this.limit.current.style.maxWidth = 'unset';
  };

  setWidth = () => {
    const { maxValue } = this.props;
    const { value } = this.state;
    const pRect = this.container.current.getBoundingClientRect();

    // We directly set the styles and not save it to state to prevent re-renders
    this.slider.current.style.width = (value / maxValue) * pRect.width + 'px';
  };

  changeValue = (value: number) => {
    if (value === this.props.value) {
      return;
    }

    if (this.props.onChange) {
      this.props.onChange(value);
    } else {
      this.setState({ value });
    }
  };

  handleMouseUp = (event: any) => (this.mouseDown = false);

  handleMouseDown = (event: React.MouseEvent) => {
    event.persist();
    this.mouseDown = true;
    this.handleMouseMove(event);
  };

  handleMouseMove = (event: any) => {
    if (!this.mouseDown || this.container.current === null) {
      return;
    }

    const maxValue = this.props.maxValue;
    const pRect = (this.container
      .current as HTMLDivElement).getBoundingClientRect();
    let left = event.clientX - pRect.left;

    left = left > pRect.width ? pRect.width : left;
    left = left < 0 ? 0 : left;

    this.changeValue((left / pRect.width) * maxValue);
  };

  render() {
    const { classes, disabled, knob, round, maxValue } = this.props;
    const { value } = this.state;
    const containerStyle = pick(this.props, ['minWidth', 'maxWidth', 'width']);
    const containerClass = cx(classes.container, {
      [classes.disabled]: disabled,
      [classes.isKnob]: knob,
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
