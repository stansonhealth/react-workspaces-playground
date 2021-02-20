import React from 'react';
import {makeStyles} from "@material-ui/core";
import {color} from "@stanson/constants/themes/colors";

interface Props {
  name?: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: color['neutral-30'],
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(6),
    minHeight: 600,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4
  }
}));

const ContentWrapper: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {props.children}
    </div>
  );
};

export default ContentWrapper;
