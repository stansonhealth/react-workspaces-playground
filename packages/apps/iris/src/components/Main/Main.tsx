import React from "react";
import {UserStore, UserName} from "@stanson/components";
import {AppBar, makeStyles, Toolbar} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const Main: React.FC = () => {
  const classes = useStyles();
  const {state} = React.useContext(UserStore);

  return (
    <div className={classes.root}>

    <AppBar position="static">
      <Toolbar variant="dense">
        {
          state.userDetails?.organization &&
          <UserName
            firstName={state.userDetails?.firstName || ''}
            lastName={state.userDetails?.lastName || ''}
            organizations={state.userDetails?.organizations || []}
            currentOrg={state.userDetails.organization} />
          }
        </Toolbar>
    </AppBar>
    </div>
    )
}

export default Main
