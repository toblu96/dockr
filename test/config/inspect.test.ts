import { describe, it, expect, beforeEach, afterEach } from "vitest";
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
        Name: "inspect-Config1",
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
        Name: "inspect-Config2",
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
    {
      Spec: {
        Name: "inspect-Config3",
        Data: "Hello from config-3",
        Labels: {
          nope: "label3",
        },
        Templating: {
          Name: "example-driver",
          Options: {
            OptionA: "value3 for driver-specific option A",
            OptionB: "value3 for driver-specific option B",
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
  it("should inspect a single config by its id without error", async ({
    dockerClient,
    testConfigArray,
  }) => {
    let { config, error } = await dockerClient.config.inspect({
      id: testConfigArray[2].ID as string,
    });

    expect(config?.ID).toBe(testConfigArray[2].ID);
    expect(config?.Spec).toEqual(testConfigArray[2].Spec);
    expect(error).toBeUndefined();
  });
});
