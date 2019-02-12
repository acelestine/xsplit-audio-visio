import * as React from 'react';
import withStyles from 'react-jss';
import { triangle } from 'polished';
import cx from 'classnames';

import { Props as OptionProps } from './Option';

const { useState, useEffect } = React;
const styles = (theme: any) => ({
  container: {
    alignItems: 'center',
    border: [1, 'solid', 'black'],
    cursor: 'pointer',
    color: theme.inputColor,
    display: 'flex',
    height: '1.8em',
    justifyContent: 'space-between',
    padding: [0, 10],
    position: 'relative',
    width: '20em',
    outline: 'none',

    '> label': {
      background: theme.inputBackgroundColor,
      pointer: 'cursor',
    },
    '&:hover $arrow': {
      borderTopColor: theme.arrowColorHover,
    },
  },
  arrow: {
    ...triangle({
      pointingDirection: 'bottom',
      foregroundColor: theme.arrowColor,
      width: 8,
      height: 4,
    }),
  },
  dropdown: {
    display: 'none',
    position: 'absolute',
    top: '1.8em',

    '&.visible': {
      display: 'block',
    },
  },
});

interface Props {
  classes: any;
  children?:
    | React.ReactElement<OptionProps>
    | React.ReactElement<OptionProps>[];
  value?: string;
  onSelect?: (event: React.BaseSyntheticEvent) => void;
}

interface ChildValuesType {
  value: string;
  label: string;
}

function Select({ classes, children, value }: Props) {
  const [childValues, setChildValues] = useState(
    ([] as unknown) as ChildValuesType[]
  );
  const [selected, setSelected] = useState('');
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    const items = React.Children.map(children, (child: any) => ({
      value: child.props.value,
      label: child.props.children,
    }));

    setChildValues(items);
  }, [children]);

  useEffect(() => {
    const item = childValues.find(
      (child: ChildValuesType) => child.value === value
    );

    setSelected(item ? item.label : '');
  }, [value, childValues]);

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = event.target as HTMLDivElement;

    if (target.dataset.ident === 'select') {
      setExpanded(true);
    }
  }

  function handleBlur(event: React.FocusEvent) {
    setExpanded(false);
  }

  // @HACK: Using datasets because we cannot use refs
  return (
    <div
      className={classes.container}
      onClick={handleClick}
      onBlur={handleBlur}
      data-ident="select"
      tabIndex={-1}
    >
      <label>{selected}</label>

      <div className={classes.arrow} />

      <div className={cx(classes.dropdown, { visible: isExpanded })}>
        {children}
      </div>
    </div>
  );
}

export default withStyles(styles)(Select);
