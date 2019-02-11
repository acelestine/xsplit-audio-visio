import * as React from 'react';
import withStyles from 'react-jss';

const styles = (theme: any) => ({
  container: {
    display: 'block',
    margin: ['0.5em', '0.8em'],
    paddingTop: '1.6em',
    position: 'relative',
    '& label': {
      color: theme.labelColor,
      fontSize: '1em',
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
  children: React.ReactChild;
  classes: any;
  label: string;
}

function Section({ label, children, classes }: Props) {
  return (
    <div className={classes.container}>
      <label>{label}</label>

      <div className={classes.content}>{children}</div>
    </div>
  );
}

export default withStyles(styles)(Section);
