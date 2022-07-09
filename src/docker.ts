import got, { Got, RequestError } from "got";
import {
  createContainerInterface,
  ContainerInterface,
} from "./controllers/container.js";
import {
  createVolumeInterface,
  VolumeInterface,
} from "./controllers/volume.js";

interface DockerClient {
  /**
   * Create and manage containers.
   */
  container: ContainerInterface;

  /**
   * Create and manage persistent storage that can be attached to containers.
   */
  volume: VolumeInterface;
}

export function createDockerClient(): DockerClient {
  // create docker instance
  const dockerInstance: Got = got.extend({
    prefixUrl: "http://localhost:2375",
    responseType: "json",
    resolveBodyOnly: true,
    hooks: {
      beforeError: [
        (error): any => {
          const { code, message, response } = error as RequestError;

          if (code === "ECONNREFUSED") {
            console.error(
              `❗ [Docker Client] Could not establish connection to Docker Host: ${message}`
            );
          } else if (
            code === "ERR_NON_2XX_3XX_RESPONSE" &&
            response?.statusCode === 404
          ) {
            console.error(
              `❗ [Docker Client] Could not find endpoint url: ${response.requestUrl}`
            );
          } else {
            console.error(
              /* @ts-ignore */
              `❗ [Docker Client] Unexpected error ${response?.statusCode} (${response?.statusMessage}): ${error} \n -> ${response?.body.message} `
            );
          }

          return error;
        },
      ],
    },
  });

  const app: DockerClient = {} as DockerClient;
  app.container = createContainerInterface(dockerInstance);
  app.volume = createVolumeInterface(dockerInstance);

  return app as DockerClient;
}
