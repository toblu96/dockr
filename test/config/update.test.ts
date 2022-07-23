import { describe, it, expect, beforeEach, afterEach, afterAll } from "vitest";
import { createDockerClient, DockerClient } from "../../src/index";
import { Config } from "../../src/types";

declare module "vitest" {
  export interface TestContext {
    dockerClient: DockerClient;
    testConfigArray: Config[];
  }
}

beforeEach(async (context) => {
  // extend context
  context.dockerClient = createDockerClient();
  // setup configs for testing
  context.testConfigArray = [
    {
      Spec: {
        Name: "update-Config1",
        Data: "Hello from config-1",
        Labels: {
          nope: "label1",
        },
        Templating: {
          Name: "example-driver",
          Options: {
            OptionA: "value1 for driver-specific option A",
            OptionB: "value1 for driver-specific option B",
          },
        },
      },
    },
    {
      Spec: {
        Name: "update-Config2",
        Data: "Hello from config-2",
        Labels: {
          nope: "label2",
        },
        Templating: {
          Name: "example-driver",
          Options: {
            OptionA: "value2 for driver-specific option A",
            OptionB: "value2 for driver-specific option B",
          },
        },
      },
    },
  ];

  for (const [index, configData] of context.testConfigArray.entries()) {
    let config = await context.dockerClient.config.create({
      data: configData.Spec!,
    });
    // add id to context
    context.testConfigArray[index].ID = config.configId?.ID;
  }
});

afterEach(async (context) => {
  // delete all datasets
  for (const configData of context.testConfigArray) {
    await context.dockerClient.config.delete({
      id: configData.ID as string,
    });
  }
});

describe("The docker config function", () => {
  it.skip("should update a single config by id and version without error", async ({
    dockerClient,
    testConfigArray,
  }) => {
    let labelUpdate = {
      nope: "new value",
    };
    // get version
    let { configs: versionConfigs, error: versionError } =
      await dockerClient.config.list({
        filters: {
          id: [testConfigArray[0].ID!],
        },
      });

    let { done, error } = await dockerClient.config.update({
      id: testConfigArray[0].ID!,
      version: versionConfigs![0].Version?.Index!,
      data: {
        Labels: labelUpdate,
      },
    });

    let { configs, error: listError } = await dockerClient.config.list({
      filters: {
        id: [testConfigArray[0].ID!],
      },
    });

    expect(done).toBe(true);
    expect(error).toBeUndefined();
    expect(configs?.length).toBe(1);
    expect(configs![0].Spec?.Labels).toEqual(labelUpdate);
  });
});
