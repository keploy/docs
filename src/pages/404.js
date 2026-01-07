import { useEffect } from "react";
import { useHistory } from "@docusaurus/router";

export default function Custom404() {
  const history = useHistory();

  useEffect(() => {
    history.replace("/docs");
  }, [history]);

  return null;
}
