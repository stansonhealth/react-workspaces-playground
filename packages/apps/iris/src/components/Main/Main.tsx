import React from "react";
import {UserStore, SiteHeader, ContentWrapper} from "@stanson/components";
import {Container} from "@material-ui/core";

const Main: React.FC = () => {
  const {state} = React.useContext(UserStore);

  return (
    <React.Fragment>
      <SiteHeader maxWidth="xl" />
      <Container maxWidth="xl">
        <ContentWrapper>hello</ContentWrapper>
      </Container>
    </React.Fragment>
    )
}

export default Main
