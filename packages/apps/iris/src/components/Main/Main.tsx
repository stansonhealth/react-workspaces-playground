import React, {useEffect, useState} from "react";
import {ApiStore, SiteHeader, ContentWrapper} from "@stanson/components";
import {Container} from "@material-ui/core";

const Main: React.FC = () => {
  const { api } = React.useContext(ApiStore);

  const [response, setResponse] = useState();

  useEffect(() => {
      (async () => {
        api.get("userDetails").then((response) => {
          setResponse(response.data);
        }).catch((err: Error) => {
          console.log(err);
        })
      })()
  }, [api])

  return (
    <React.Fragment>
      <SiteHeader maxWidth="xl" />

      <Container maxWidth="xl">
        <ContentWrapper>
          <div><a href="http://localhost:3002">GO TO MIA</a></div>
          <div>{JSON.stringify(response, null, 2)}</div>
          </ContentWrapper>
      </Container>
    </React.Fragment>
    )
}

export default Main
