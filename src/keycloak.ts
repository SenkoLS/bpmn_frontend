import Keycloak from "keycloak-js";
import { config } from "@app/config";

const keycloak = new (Keycloak as any)({
  url: config.keycloakUrl,
  realm: config.keycloakRealm,
  clientId: config.keycloakClientId,
});

export default keycloak;
