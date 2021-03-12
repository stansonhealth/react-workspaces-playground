import React, {useState} from "react";
import {
  Button,
  Link as MuiLink,
  makeStyles,
  MenuItem,
  Select,
  Typography, withStyles
} from "@material-ui/core";
import BackgroundImage from './header-bg.png';
import {UserDetailsModel} from "../interfaces";
import {ChevronDown, Home, LogOut, HelpCircle} from "react-feather";
import {color, ISideNavLink, NavigationGroupModel} from "@stanson/constants";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import SideNavGroupLabel from "./SideNavGroupLabel";
import {Link} from "react-router-dom";

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

const AccordionSummary = withStyles(theme => ({
  root: {
    backgroundColor: "white",
    borderBottom: '0px',
    minHeight: 40,
    '&$expanded': {
      minHeight: 40,
    },
  },
  content: {
    margin: `${theme.spacing(0.5)}px 14px`,
    '&$expanded': {
      margin: `${theme.spacing(0.5)}px 14px`,
    },
  },
  expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    borderLeft: `5px solid ${theme.palette.primary.main}`,
    padding: `0px ${theme.spacing(2) + 2}px`,
    backgroundColor: color["neutral-10"]
  },
}))(MuiAccordionDetails);

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
    marginTop: theme.spacing(2),
    width: 470,
    overflowY: "auto",
    overflowX: "hidden"
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  linkButton: {
    justifyContent: "left",
  }
}));

interface Props {
  user: UserDetailsModel,
  navigation: {
    links: ISideNavLink[],
    groups: NavigationGroupModel[]
  },
  closeMe: () => void
}

const SideNav: React.FC<Props> = (props) => {
  const classes = useStyles();

  const firstName = "dev"
  const lastName = "dev"

  const [openMenu, setOpenMenu] = useState<string>()

  const handleNavClick = (link: ISideNavLink) => {
    window.location.href = `${process.env.REACT_APP_STANSON_API}#${link.path}`;
  }

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
            >
              <SideNavGroupLabel icon={group.icon} name={group.name} />
            </AccordionSummary>
            <AccordionDetails>
              <div>
                {
                  props.navigation.links.filter(link => link.location === group.name)
                    .map(link => (
                      <React.Fragment key={link.path}>
                      {
                        link.app === 'legacy' &&
                          <Button className={classes.linkButton} onClick={() => handleNavClick(link)} fullWidth>{link.name}</Button>
                      }
                        {
                          link.app !== 'legacy' &&
                          <Button
                            component={Link}
                            className={classes.linkButton}
                            to={link.path}
                            fullWidth>{link.name}</Button>
                        }
                      </React.Fragment>
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
          <MuiLink underline="none" href={process.env.REACT_APP_STANSON_API} className={classes.userNavLink}>
            <Home size={14} /> home
          </MuiLink>
          <MuiLink underline="none" className={classes.userNavLink}>
            <HelpCircle size={14} /> support
          </MuiLink>
        </div>
        <MuiLink underline="none">
          <LogOut size={14} /> logout
        </MuiLink>
      </div>
    </div>
      {accordianStyle()}
    </React.Fragment>
  )
}

export default SideNav;
