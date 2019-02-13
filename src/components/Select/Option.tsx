import * as React from 'react';
import withStyles from 'react-jss';

export interface Props {
  children: string;
  value: string;
  classes: any;
}

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
});

function Option({ classes, children, value }: Props) {
  return (
    <div className={classes.option} data-ident="option" data-value={value}>
      {children}
    </div>
  );
}

export default withStyles(styles)(Option);
