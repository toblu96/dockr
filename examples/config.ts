import { createDockerClient } from "../src/index.js";

const dockerClient = createDockerClient();

// list configs
let { configs, error } = await dockerClient.config.list();

console.log(configs);
