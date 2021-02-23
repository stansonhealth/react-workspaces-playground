import React, {useEffect, useState} from "react";
import {UserStore, SiteHeader, ContentWrapper} from "@stanson/components";
import {Container} from "@material-ui/core";

const Main: React.FC = () => {
  const {api} = React.useContext(UserStore);
  const [response, setResponse] = useState();

  useEffect(() => {
    if (api) {
      (async () => {
        api.get("hello-world").then((response) => {
          setResponse(response.data);
        }).catch((err: Error) => {
          console.log(err);
        })
      })()
    }
  }, [api])

  return (
    <React.Fragment>
      <SiteHeader maxWidth="xl" />
      <Container maxWidth="xl">
        <ContentWrapper>{JSON.stringify(response, null, 2)}</ContentWrapper>
      </Container>
    </React.Fragment>
    )
}

export default Main
