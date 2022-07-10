import { createDockerClient } from "../src/index.js";

const dockClient = createDockerClient();

// async function runLocal() {
//   let { containers, error } = await dockClient.container.list();

//   if (containers && containers.length > 0) console.log(containers[0]?.Names);
//   console.log(error);
// }

// runLocal();

let { volumes, error } = await dockClient.volume.prune({
  filters: {
    label: ["com.docker.compose.project=moleculer-demo"],
  },
});

if (volumes) {
  console.log(volumes);
  console.log(`\n\n ℹ️ Deleted ${volumes.VolumesDeleted?.length} volumes \n\n`);
}
if (error) console.log(error);

// let filterObj = {};
// filterObj["name"] = "hello";

// console.log(JSON.stringify([filterObj]));
