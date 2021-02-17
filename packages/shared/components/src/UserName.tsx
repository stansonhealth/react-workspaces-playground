import React from "react";
import {User} from "react-feather";
import {FormControl, InputLabel, makeStyles, MenuItem, Select} from "@material-ui/core";
import {Organization} from "@stanson/constants/interfaces/User";

interface Props {
  firstName: string;
  lastName: string;
  organizations: Organization[],
  currentOrg: Organization
}

const useStyles = makeStyles((theme) => ({
  names: {
    fontSize: theme.typography.fontSize * 1.5,
    paddingLeft: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 320,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const UserName: React.FC<Props> = (props) => {
  const [org] = React.useState<number>(props.currentOrg.id);
  const classes = useStyles();

  return(
    <div>
      <User />
      <span className={classes.names}>{props.firstName}</span>
      <span className={classes.names}>{props.lastName}</span>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Organization</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={org}
          label="Age"
        >
          {props.organizations.map((orgInstance => (
            <MenuItem key={orgInstance.id} value={orgInstance.id}>
              <em>{orgInstance.name}</em>
            </MenuItem>
          )))}
        </Select>
      </FormControl>
    </div>
  )
}

export default UserName

