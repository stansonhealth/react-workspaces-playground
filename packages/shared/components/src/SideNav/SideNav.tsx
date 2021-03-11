import React, {useState} from "react";
import {
  Button, Collapse,
  Link, List, ListItem, ListItemIcon, ListItemText,
  makeStyles,
  MenuItem,
  Select,
  Typography, withStyles
} from "@material-ui/core";
import BackgroundImage from './header-bg.png';
import {UserDetailsModel} from "../interfaces";
import {ChevronDown, Home, LogOut, HelpCircle, Search} from "react-feather";
import {color, ISideNavLink, NavigationGroupModel} from "@stanson/constants";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import SideNavGroupLabel from "./SideNavGroupLabel";

const Accordion = withStyles({
  root: {
    border: '0px',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "white",
    borderBottom: '0px',
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    borderLeft: `2px solid ${theme.palette.primary}`,
    padding: theme.spacing(2),
    backgroundColor: color["neutral-10"]
  },
}))(MuiAccordionDetails);


const NavLinkButton = withStyles((theme) => ({
  label: {
    justifyContent: "left"
  }
}))(Button);

const useStyles = makeStyles(theme => ({
  userSection: {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: "1180px 140px",
    borderBottom: `2px solid ${theme.palette.neutral.primary}`,
    width: 470,
    position: "relative",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  username: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0`
  },
  organizations: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px 0`
  },
  usernav: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0`,
    display: "flex",
  },
  userNavLeft: {
    flexGrow: 1
  },
  userNavLink: {
    marginRight: theme.spacing(1)
  },
  organizationSelect: {
    color: theme.palette.neutral.primary
  },
  accordian: {
    width: 470,
    overflowY: "auto",
    overflowX: "hidden"
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

interface Props {
  user: UserDetailsModel,
  navigation: {
    links: ISideNavLink[],
    groups: NavigationGroupModel[]
  }
}

const SideNav: React.FC<Props> = (props) => {
  const classes = useStyles();

  const firstName = "dev"
  const lastName = "dev"

  const [openMenu, setOpenMenu] = useState<string>()

  const handleChange = (e: React.FormEvent) => {
    console.log(e);
  };

  const accordianStyle = () => (
    <div className={classes.accordian}>
      {
        props.navigation &&
        props.navigation.groups.map(group => (
          <Accordion key={group.name} expanded={openMenu === group.name} onChange={
            () => (openMenu === group.name) ? setOpenMenu("") : setOpenMenu(group.name)
          }>
            <AccordionSummary
              expandIcon={<ChevronDown />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <SideNavGroupLabel icon={group.icon} name={group.name} />
            </AccordionSummary>
            <AccordionDetails>
              <div>
                {
                  props.navigation.links.filter(link => link.location === group.name)
                    .map(link => (
                      <NavLinkButton fullWidth>{link.name}</NavLinkButton>
                    ))
                }
              </div>
            </AccordionDetails>
          </Accordion>
        ))
      }
    </div>
  )

  return (
    <React.Fragment>
    <div className={classes.userSection}>
      <Typography className={classes.username} variant="h4" color="textPrimary">
        {firstName} {lastName}
      </Typography>
      { props.user.organizations.length > 1 &&
        <div className={classes.organizations}>
          <Select
            className={classes.organizationSelect}
            labelId="label"
            IconComponent={ChevronDown}
            value={props.user.currentOrganization.id}
          >
            {
              props.user.organizations.map(org => (
                <MenuItem value={org.id} key={org.id}>{org.name}</MenuItem>
              ))
            }
          </Select>
        </div>
      }
      {
        props.user.organizations.length === 1 &&
        <Typography>{props.user.organizations[0].name}</Typography>
      }
      <div className={classes.usernav}>
        <div className={classes.userNavLeft}>
          <Link underline="none" href={process.env.REACT_APP_STANSON_API} className={classes.userNavLink}>
            <Home size={14} /> home
          </Link>
          <Link underline="none" className={classes.userNavLink}>
            <HelpCircle size={14} /> support
          </Link>
        </div>
        <Link underline="none">
          <LogOut size={14} /> logout
        </Link>
      </div>
    </div>
      {accordianStyle()}
    </React.Fragment>
  )
}

export default SideNav;
