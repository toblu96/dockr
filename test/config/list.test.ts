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
        Name: "list-Config1",
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
        Name: "list-Config2",
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
        Name: "list-Config3",
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
  it("should list all configs without error", async ({
    dockerClient,
    testConfigArray,
  }) => {
    let { configs, error } = await dockerClient.config.list();

    if (configs)
      // check if all test configs exist
      for (const config of testConfigArray) {
        expect(config.Spec?.Name).toEqual(
          testConfigArray.find((x) => x.Spec?.Name === config.Spec?.Name)?.Spec
            ?.Name
        );
      }
    expect(error).toBeUndefined();
  });

  it("should list a filtered config by id", async ({
    dockerClient,
    testConfigArray,
  }) => {
    let { configs, error } = await dockerClient.config.list({
      filters: {
        id: [testConfigArray[1].ID as string],
      },
    });

    expect(configs?.length).toBe(1);
    expect(configs![0].ID).toBe(testConfigArray[1].ID);
    expect(configs![0].Spec).toEqual(testConfigArray[1].Spec);
    expect(error).toBeUndefined();
  });

  it("should list a filtered config by name", async ({
    dockerClient,
    testConfigArray,
  }) => {
    let { configs, error } = await dockerClient.config.list({
      filters: {
        name: [testConfigArray[1].Spec?.Name as string],
      },
    });

    expect(configs?.length).toBe(1);
    expect(configs![0].ID).toBe(testConfigArray[1].ID);
    expect(configs![0].Spec).toEqual(testConfigArray[1].Spec);
    expect(error).toBeUndefined();
  });

  it("should list a filtered config by label", async ({
    dockerClient,
    testConfigArray,
  }) => {
    let { configs, error } = await dockerClient.config.list({
      filters: {
        label: [
          new URLSearchParams(testConfigArray[1].Spec?.Labels).toString(),
        ],
      },
    });

    expect(configs?.length).toBe(1);
    expect(configs![0].ID).toBe(testConfigArray[1].ID);
    expect(configs![0].Spec).toEqual(testConfigArray[1].Spec);
    expect(error).toBeUndefined();
  });
});
