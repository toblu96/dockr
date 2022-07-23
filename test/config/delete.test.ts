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
        Name: "delete-Config1",
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
        Name: "delete-Config2",
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
  it("should delete a single config by id without error", async ({
    dockerClient,
    testConfigArray,
  }) => {
    let { done, error } = await dockerClient.config.delete({
      id: testConfigArray[0].ID!,
    });

    let { configs, error: deleteError } = await dockerClient.config.list({
      filters: {
        id: [testConfigArray[0].ID!],
      },
    });

    expect(done).toBe(true);
    expect(error).toBeUndefined();
    expect(configs?.length).toBe(0);
    expect(deleteError).toBeUndefined();
  });

  it("should delete a single config by id without error", async ({
    dockerClient,
    testConfigArray,
  }) => {
    let { done, error } = await dockerClient.config.delete({
      id: testConfigArray[1].Spec?.Name!,
    });

    let { configs, error: deleteError } = await dockerClient.config.list({
      filters: {
        id: [testConfigArray[1].Spec?.Name!],
      },
    });

    expect(done).toBe(true);
    expect(error).toBeUndefined();
    expect(configs?.length).toBe(0);
    expect(deleteError).toBeUndefined();
  });
});
