import { createDockerClient } from "../src/index.js";

const dockClient = createDockerClient();

// async function runLocal() {
//   let { containers, error } = await dockClient.container.list();

//   if (containers && containers.length > 0) console.log(containers[0]?.Names);
//   console.log(error);
// }

// runLocal();

let { volumes, error } = await dockClient.volume.inspect({
  name: "2daff1f4df364237896f14b9fa6b824c17c868fcb5de1fd594edc979d53cd05c",
});

if (volumes) {
  console.log(volumes);
  console.log(`\n\n ℹ️ Found ${volumes} volumes \n\n`);
}
if (error) console.log(error);

// let filterObj = {};
// filterObj["name"] = "hello";

// console.log(JSON.stringify([filterObj]));
