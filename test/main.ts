import { createDockerClient } from "../src/index.js";

const dockClient = createDockerClient();

// async function runLocal() {
//   let { containers, error } = await dockClient.container.list();

//   if (containers && containers.length > 0) console.log(containers[0]?.Names);
//   console.log(error);
// }

// runLocal();

let { done, error } = await dockClient.volume.delete({
  name: "hasura",
  force: false,
});

if (done) {
  console.log(done);
  console.log(`\n\n ℹ️ Found ${1} volumes \n\n`);
}
if (error) console.log(error);

// let filterObj = {};
// filterObj["name"] = "hello";

// console.log(JSON.stringify([filterObj]));
