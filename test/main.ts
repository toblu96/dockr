import { createDockerClient } from "../src/index.js";

let dockClient = createDockerClient();

async function runLocal() {
  console.log("hello");

  try {
    let containers = await dockClient.container.listAll();
    console.log(containers);
  } catch (error) {
    console.error(error);
  }
}

runLocal();
