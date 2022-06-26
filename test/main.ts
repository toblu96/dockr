import { createDockerClient } from "../src/index.js";

const dockClient = createDockerClient();

async function runLocal() {
  let { containers, error } = await dockClient.container.list();

  if (containers) console.log(containers[0]?.Names);
  console.log(error);
}

runLocal();
