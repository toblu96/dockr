import { createDockerClient } from "../src/index.js";

const dockClient = createDockerClient();

// async function runLocal() {
//   let { containers, error } = await dockClient.container.list();

//   if (containers && containers.length > 0) console.log(containers[0]?.Names);
//   console.log(error);
// }

// runLocal();

let { volumes, error } = await dockClient.volume.create({
  volumeConfig: {
    Name: "config",
    Driver: "local",
    DriverOpts: {
      device: "tmpfs",
      type: "tmpfs",
    },
    Labels: {
      "some.own.label": "nope",
      "com.example.some-label": "some-value",
      "com.example.some-other-label": "some-other-value",
    },
  },
});

if (volumes) {
  console.log(volumes);
  console.log(`\n\n ℹ️ Found ${volumes} volumes \n\n`);
}
if (error) console.log(error);

// let filterObj = {};
// filterObj["name"] = "hello";

// console.log(JSON.stringify([filterObj]));
