import React from "react";
import {Button, makeStyles, Typography, withStyles} from "@material-ui/core";
import {IconNameType} from "@stanson/constants";
import * as icons from 'react-feather';

interface Props {
  icon: IconNameType;
  name: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex"
  },
  label: {
    marginLeft: theme.spacing(1)
  }
}));

const LabelTypography = withStyles((theme) => ({
  button: {
    fontSize: "1rem",
    fontWeight: 300
  }
}))(Typography);

const SideNavGroupLabel: React.FC<Props> = (props) => {
  const classes = useStyles();
  const iconName: IconNameType = props.icon.charAt(0).toUpperCase() + props.icon.slice(1) as IconNameType;
  const IconComponent = icons[iconName] || icons['List'];

  return (
    <div className={classes.root}><IconComponent /><LabelTypography variant="button" className={classes.label}>{props.name}</LabelTypography></div>
  )
}

export default SideNavGroupLabel;
