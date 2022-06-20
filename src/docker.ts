import got, { Got } from "got";
import {
  createContainerInterface,
  ContainerInterface,
} from "./modules/container.js";

interface DockerClient {
  container: ContainerInterface;
}

export function createDockerClient(): DockerClient {
  // create docker instance
  const dockerInstance = got.extend({
    prefixUrl: "http://localhost:2375",
    responseType: "json",
    resolveBodyOnly: true,
  });

  const app: DockerClient = {} as DockerClient;
  app.container = createContainerInterface(dockerInstance);

  return app as DockerClient;
}
