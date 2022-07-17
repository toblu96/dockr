import { describe, it, expect, beforeEach } from "vitest";
import { createDockerClient, DockerClient } from "../../src/index";
import { VolumeCreateOptions } from "../../src/types";

declare module "vitest" {
  export interface TestContext {
    dockerClient: DockerClient;
    testVolume: VolumeCreateOptions;
    pruneVolume: VolumeCreateOptions;
  }
}

beforeEach(async (context) => {
  // extend context
  context.dockerClient = createDockerClient();
  // test volume configuration
  context.testVolume = {
    Name: "test-volume",
    Labels: {
      "com.example.some-label": "some-value",
      "com.example.some-other-label": "some-other-value",
    },
    Driver: "local",
    DriverOpts: {
      device: "tmpfs",
      o: "size=100m,uid=1000",
      type: "tmpfs",
    },
  };
  context.pruneVolume = {
    Name: "prune-volume",
  };
});

describe("The docker volume function", () => {
  it("should create a new volume without error", async ({
    dockerClient,
    testVolume,
  }) => {
    let { volume, error } = await dockerClient.volume.create({
      volumeConfig: testVolume,
    });

    expect(volume?.Name).toBe(testVolume.Name);
    expect(volume?.Driver).toBe(testVolume.Driver);
    expect(volume?.Labels).toEqual(testVolume.Labels);
    expect(volume?.Options).toEqual(testVolume.DriverOpts);
    expect(error).toBeUndefined();
  });

  it("should list all existing volumes without error", async ({
    dockerClient,
    testVolume,
  }) => {
    let { volumes, error } = await dockerClient.volume.list();

    expect(volumes?.length).toBeGreaterThan(0);
    expect(volumes![0].Name).toBe(testVolume.Name);
    expect(volumes![0].Driver).toBe(testVolume.Driver);
    expect(volumes![0].Labels).toEqual(testVolume.Labels);
    expect(volumes![0].Options).toEqual(testVolume.DriverOpts);
    expect(error).toBeUndefined();
  });

  it("should inspect the existing volume without error", async ({
    dockerClient,
    testVolume,
  }) => {
    let { volume, error } = await dockerClient.volume.inspect({
      name: testVolume.Name as string,
    });

    expect(volume?.Name).toBe(testVolume.Name);
    expect(volume?.Driver).toBe(testVolume.Driver);
    expect(volume?.Labels).toEqual(testVolume.Labels);
    expect(volume?.Options).toEqual(testVolume.DriverOpts);
    expect(error).toBeUndefined();
  });

  it("should delete the existing volume without error", async ({
    dockerClient,
    testVolume,
  }) => {
    let { done, error } = await dockerClient.volume.delete({
      name: testVolume.Name as string,
    });

    let { volume, error: inspectError } = await dockerClient.volume.inspect({
      name: testVolume.Name as string,
    });

    expect(done).toBeTruthy();
    expect(error).toBeUndefined();
    expect(volume).toBeUndefined();
    expect(inspectError?.code).toBe(404);
  });

  it("should prune the unused volume without error", async ({
    dockerClient,
    pruneVolume,
  }) => {
    // create unused volume
    let { volume, error } = await dockerClient.volume.create({
      volumeConfig: pruneVolume,
    });

    let { volumes: prunedVolumes, error: pruneError } =
      await dockerClient.volume.prune();

    // volume creation
    expect(volume?.Name).toBe(pruneVolume.Name);
    expect(error).toBeUndefined();

    // volume prune
    expect(prunedVolumes?.VolumesDeleted![0]).toBe(pruneVolume.Name);
    expect(pruneError).toBeUndefined();
  });
});
