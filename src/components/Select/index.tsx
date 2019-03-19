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
    background: theme.backgroundColor,

    '& > label': {
      cursor: 'pointer',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: 'white',
    },
    '&:hover': {
      background: theme.inputBackgroundColorHover,
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

  // @HACK: Effin hack because `onBlur` property gets called even if you did not really blur it.
  function hackClickOutside(event: MouseEvent) {
    const target = event.target as HTMLDivElement;
    const closestTarget = target.closest(`.${classes.container}`);
    const ident = target.dataset.ident;

    if (
      ident !== 'select' &&
      (!closestTarget ||
        (closestTarget as HTMLElement).dataset.ident !== 'select')
    ) {
      setExpanded(false);
    }
  }

  useEffect(() => {
    document.body.addEventListener('click', hackClickOutside);

    return () => {
      document.body.removeEventListener('click', hackClickOutside);
    };
  }, []);

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
    const isClosestSelect =
      ident === 'select' ||
      (closestTarget as HTMLElement).dataset.ident === 'select';

    if (isClosestSelect && ident !== 'option-text') {
      setExpanded(!isExpanded);
    }

    if (ident === 'option' && typeof onSelect === 'function') {
      onSelect(event, target.dataset.value || '');
    }
  }

  return (
    <div
      className={classes.container}
      onClick={handleClick}
      data-ident="select"
      tabIndex={0}
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
