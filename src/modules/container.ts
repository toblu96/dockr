import { Got } from "got";
import { Port, SummaryNetworkSettings, MountPoint } from "../types.js";

export interface ContainerInterface {
  list(): string;
  listAll(): Promise<Container[]>;
}

export interface Container {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Created: number;
  Ports: Port[];
  SizeRw?: number;
  SizeRootFs?: number;
  Labels: { [key: string]: string };
  State: string;
  Status: string;
  HostConfig: {
    NetworkMode?: string;
  };
  NetworkSettings?: SummaryNetworkSettings;
  Mounts: MountPoint[];
}

export function createContainerInterface(gotInstance: Got): ContainerInterface {
  const list = function () {
    return "hello from container module";
  };

  const listAll = async function () {
    return (await gotInstance.get("containers/json").json()) as Container[];
  };

  const container: ContainerInterface = {} as ContainerInterface;
  container.list = list;
  container.listAll = listAll;

  return container as ContainerInterface;
}
