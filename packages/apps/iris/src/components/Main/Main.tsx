import React, {useEffect, useState} from "react";
import {ApiStore, SiteHeader, ContentWrapper, SideNav} from "@stanson/components";
import {ClickAwayListener, Container, Drawer} from "@material-ui/core";
import {IAppConfig} from "@stanson/constants";

const Main: React.FC = () => {
  const { api } = React.useContext(ApiStore);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState();
  const [navigation, setNavigation] = useState();

  useEffect(() => {
      (async () => {
        await api.get("userDetails").then((response) => {
          setUserDetails(response.data);
          console.log(response.data);
        }).catch((err: Error) => {
          console.log(err);
        })

        await api.get<IAppConfig>("initialize").then((response) => {
          const appConfig: IAppConfig = response.data
          setNavigation({
            links: appConfig.navigation,
            groups: appConfig.navigationGroups
          })
        }).catch((err: Error) => {
          console.log(err);
        })
      })()
  }, [api])

  const handleDrawerClose = () => {
    setMenuOpen(false);
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    setMenuOpen(true)
  }

  return (
    <React.Fragment>
    {
      userDetails && navigation &&
        <React.Fragment>
          <SiteHeader onMenuClick={handleMenuClick} maxWidth="xl" />
          <Container maxWidth="xl">
            <ContentWrapper>
              <div><a href="http://localhost:8080/stanson/#/home">GO TO MIA</a></div>
              <div>{JSON.stringify(setUserDetails, null, 2)}</div>
              </ContentWrapper>
          </Container>
          <Drawer transitionDuration={500} ModalProps={{ onBackdropClick: handleDrawerClose }} anchor="left" open={menuOpen} >
            { userDetails?.loggedInUser &&
              <SideNav navigation={navigation} user={userDetails.loggedInUser}></SideNav>
            }
          </Drawer>
        </React.Fragment>
      }
    </React.Fragment>
    )
}

export default Main
