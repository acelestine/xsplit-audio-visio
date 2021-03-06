import * as React from 'react';
import withStyles from 'react-jss';
import cx from 'classnames';

const styles = (theme: any) => ({
  container: {
    display: 'block',
    margin: ['0.5em'],
    paddingTop: '1.6em',
    position: 'relative',
    marginBottom: '1.6em',

    '& > label': {
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
  innerContainer: {
    background: theme.sectionInnerBackgroundColor,
    border: [1, 'solid', theme.sectionInnerBorderColor],
    padding: '0.5em',
  },
});

interface Props {
  children: React.ReactChild;
  classes: any;
  label: string;
  contentClassName?: string;
}

function Section({ label, children, classes, contentClassName }: Props) {
  return (
    <div className={classes.container}>
      <label>{label}</label>

      <div className={cx(classes.content, contentClassName)}>
        <div className={classes.innerContainer}>{children}</div>
      </div>
    </div>
  );
}

export default withStyles(styles)(Section);
