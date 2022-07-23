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
        Name: "create-Config1",
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
  ];
});

afterEach(async (context) => {
  // delete all datasets
  for (const configData of context.testConfigArray) {
    await context.dockerClient.config.delete({
      id: configData.Spec?.Name as string,
    });
  }
});

describe("The docker config function", () => {
  it("should create a single config without error", async ({
    dockerClient,
    testConfigArray,
  }) => {
    let { configId, error } = await dockerClient.config.create({
      data: testConfigArray[0].Spec!,
    });
    // add id to context
    testConfigArray[0].ID = configId?.ID;

    expect(configId?.ID).toBe(testConfigArray[0].ID);
    expect(error).toBeUndefined();
  });

  it("should create a single config with data in Base64 format", async ({
    dockerClient,
    testConfigArray,
  }) => {
    let { configId, error: createError } = await dockerClient.config.create({
      data: testConfigArray[0].Spec!,
    });

    let { configs, error } = await dockerClient.config.list({
      filters: {
        name: [testConfigArray[0].Spec?.Name!],
      },
    });

    expect(configs?.length).toBe(1);
    var base64regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    expect(base64regex.test(configs![0].Spec?.Data!)).toBe(true);
    expect(error).toBeUndefined();
  });
});
