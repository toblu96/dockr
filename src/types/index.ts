// https://pkg.go.dev/github.com/docker/docker@v20.10.17+incompatible/api/types
// https://stirlingmarketinggroup.github.io/go2ts/

import { RequestError } from "got";
import { mount } from "./mount.js";
import { EndpointSettings } from "./network.js";

export * from "./container.js";
export * from "./volume.js";
export * from "./config.js";
export * from "./mount.js";
export * from "./network.js";

export interface Port {
  IP?: string;
  PrivatePort: number;
  PublicPort?: number;
  Type: string;
}

export interface SummaryNetworkSettings {
  Networks: { [key: string]: EndpointSettings | undefined };
}

export interface MountPoint {
  Type?: mount.Type;
  Name?: string;
  Source: string;
  Destination: string;
  Driver?: string;
  Mode: string;
  RW: boolean;
  Propagation: mount.Propagation;
}

/** @description Response to an API call that returns just an Id */
export interface IdResponse {
  /** @description The id of the newly created object. */
  ID: string;
}

/**
 * dockr error response
 */
export interface ErrorResponse {
  code: number;
  message: string;
  description?: string;
}

export interface GotRequestError extends RequestError {
  readonly response?: RequestError["response"] & {
    body: {
      message?: string;
    };
  };
}
