import * as React from 'react';
import withStyles from 'react-jss';
import { triangle } from 'polished';
import cx from 'classnames';

import { Props as OptionProps } from './Option';

interface Props {
  classes: any;
  children?:
    | React.ReactElement<OptionProps>
    | React.ReactElement<OptionProps>[];
  value?: string;
  onSelect?: (event: React.BaseSyntheticEvent, data: string) => void;
}

interface ChildValuesType {
  value: string;
  label: string;
}

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
    padding: [0, 7],
    position: 'relative',
    width: '17em',
    outline: 'none',

    '& > label': {
      cursor: 'pointer',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
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
    background: theme.dropdownBackgroundColor,
    border: [1, 'solid', theme.dropdownBorderColor],
    display: 'none',
    padding: 1,
    position: 'absolute',
    top: 'calc(1.8em + 1px)',
    left: 0,
    right: 0,
    zIndex: 10,

    '&.visible': {
      display: 'block',
    },
  },
});

function Select({ classes, children, value, onSelect }: Props) {
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
    const closestTarget = target.closest(`.${classes.container}`);
    const ident = target.dataset.ident;

    if (
      ident === 'select' ||
      (closestTarget as HTMLElement).dataset.ident === 'select'
    ) {
      setExpanded(!isExpanded);
    }

    if (ident === 'option' && typeof onSelect === 'function') {
      onSelect(event, target.dataset.value || '');
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
