import React, {useEffect, useState} from "react";
import {ApiStore} from "@stanson/components";

const Main: React.FC = () => {
  const {api} = React.useContext(ApiStore);
  const [response, setResponse] = useState();

  useEffect(() => {
      (async () => {
        api.get("hello-world").then((response) => {
          setResponse(response.data);
        }).catch((err: Error) => {
          console.log(err);
        })
      })()

  }, [api])

  return (
    <React.Fragment>
      <div>{JSON.stringify(response, null, 2)}</div>
    </React.Fragment>
  )
}

export default Main
