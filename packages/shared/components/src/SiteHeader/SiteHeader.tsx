import React from 'react';
import {Container, ContainerTypeMap, makeStyles} from "@material-ui/core";

interface Props {
  name?: string;
  maxWidth: ContainerTypeMap["props"]["maxWidth"];
}

const useStyles = makeStyles(theme => ({
  root: {
    height: theme.spacing(6),
    background: theme.palette.secondary.main,
    width: '100%',
    position: 'fixed',
    zIndex: 1000
  },
  header: {
    borderBottom: `${theme.spacing(0.5)}px solid ${theme.palette.primary.main}`,
    height: theme.spacing(6),
    display: 'flex',
    background: theme.palette.secondary.main
  }
}));

const SiteHeader: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
     <Container maxWidth={props.maxWidth}>
       <div className={classes.header}>
       </div>
     </Container>
    </div>
  );
};

export default SiteHeader;
