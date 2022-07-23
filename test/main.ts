import { createDockerClient } from "../src/index.js";

const dockClient = createDockerClient();

// async function runLocal() {
//   let { containers, error } = await dockClient.container.list();

//   if (containers && containers.length > 0) console.log(containers[0]?.Names);
//   console.log(error);
// }

// runLocal();

// let { configId, error } = await dockClient.config.create({
//   data: {
//     Name: "test-config-tbl1",
//     Data: "nope",
//     Labels: {
//       nope: "label3",
//     },
//     Templating: {
//       Name: "example-driver",
//       Options: {
//         OptionA: "value3 for driver-specific option A",
//         OptionB: "value3 for driver-specific option B",
//       },
//     },
//   },
// });
// console.log(configId);
// console.log(error);

let { configs, error } = await dockClient.config.list();
let { done, error: err1 } = await dockClient.config.update({
  id: "oenotbao728znu48dc6hv7m5n",
  version: 5128,
  data: {
    Labels: {
      nope: "project",
    },
  },
});
console.log(configs![1]);
console.log(configs![1].Spec);
console.log(err1);

// let filterObj = {};
// filterObj["name"] = "hello";

// console.log(JSON.stringify([filterObj]));
