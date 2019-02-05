import * as React from 'react';
import withStyles from 'react-jss';

const styles = (theme: any) => ({
  section: {
    display: 'block',
    margin: '0.5em',
    position: 'relative',
    paddingTop: '1.6em',

    label: {
      color: theme.labelColor,
      fontSize: '1.2em',
      position: 'absolute',
      top: 0,
    },
  },
  content: {
    border: ['0.1em', 'solid', theme.borderColor],
    padding: '0.5em',
    minHeight: '1em',
  },
});

interface Props {
  classes: any;
  label: string;
  children: React.ReactChild;
}

function Section({ classes, label, children }: Props) {
  return (
    <div className={classes.section}>
      <label>{label}</label>
      <div className={classes.content}>{children}</div>
    </div>
  );
}

export default withStyles(styles)(Section);
