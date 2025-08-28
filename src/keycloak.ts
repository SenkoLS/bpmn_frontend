import Keycloak from "keycloak-js";

const keycloak = new (Keycloak as any)({
  url: "http://localhost:8081",
  realm: "bpmn-app",
  clientId: "bpmn-frontend",
});

export default keycloak;
