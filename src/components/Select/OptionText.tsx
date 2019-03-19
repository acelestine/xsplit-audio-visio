import * as React from 'react';
import withStyles from 'react-jss';

export interface Props {
  children: string;
  classes: any;
  onUpdate: (url: string) => void;
}

const { useState, useEffect, useRef } = React;

const styles = (theme: any) => ({
  option: {
    color: theme.dropdownColor,
    overflow: 'hidden',
    padding: [4, 6],
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',

    '&:hover': {
      background: theme.dropdownBackgroundColorHover,
      color: theme.dropdownColorHover,
    },
  },
  text: {
    width: 'calc(100% - 2px)',
  },
});

function OptionText({ classes, children, onUpdate }: Props) {
  const inputEl = useRef(null);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    if (showInput && inputEl.current) {
      ((inputEl.current as unknown) as HTMLInputElement).focus();
    }
  }, [showInput]);

  function handleClick() {
    setShowInput(!showInput);
  }

  function handleKeyPress(event: React.KeyboardEvent) {
    if (event.which === 13 && onUpdate) {
      onUpdate((event.target as HTMLInputElement).value);
    }
  }

  return (
    <div
      className={classes.option}
      data-ident="option-text"
      onClick={handleClick}
    >
      {showInput ? (
        <input
          className={classes.text}
          ref={inputEl}
          data-ident="option-text"
          onKeyPress={handleKeyPress}
        />
      ) : (
        children
      )}
    </div>
  );
}

export default withStyles(styles)(OptionText);
