import * as React from 'react';
import withStyles from 'react-jss';
import Loader from 'react-loader-spinner';

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
  loaderContainer: {
    textAlign: 'center',
  },
});

function OptionText({ classes, children, onUpdate }: Props) {
  const inputEl = useRef(null);
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      onUpdate((event.target as HTMLInputElement).value);
    }
  }

  const child = showInput ? (
    <input
      className={classes.text}
      ref={inputEl}
      data-ident="option-text"
      onKeyPress={handleKeyPress}
    />
  ) : (
    children
  );

  return (
    <div
      className={classes.option}
      data-ident="option-text"
      onClick={handleClick}
    >
      {}

      {isLoading ? (
        <div className={classes.loaderContainer}>
          <Loader type="Puff" color="#00BFFF" height="20" width="20" />
        </div>
      ) : (
        child
      )}
    </div>
  );
}

export default withStyles(styles)(OptionText);
