import React from 'react';
import {Button, Container, ContainerTypeMap, makeStyles} from "@material-ui/core";
import {Menu} from "react-feather";

interface Props {
  name?: string;
  maxWidth: ContainerTypeMap["props"]["maxWidth"];
  onMenuClick: (e: React.MouseEvent) => void;
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
  },
  menuIcon: {
    marginRight: theme.spacing(0.5)
  },
  menuButton: {
    color: "white",
    fontSize: "16px",
    fontWeight: 300
  }
}));

const SiteHeader: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
     <Container maxWidth={props.maxWidth}>
       <div className={classes.header}>
         <Button onClick={(e) => props.onMenuClick(e)} className={classes.menuButton}>
           <Menu size={18} color="white" className={classes.menuIcon} /> MENU
         </Button>
       </div>
     </Container>
    </div>
  );
};

export default SiteHeader;
