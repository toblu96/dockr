import { ErrorResponse, IdResponse } from "./index.js";

export interface Config {
  ID?: string;
  Version?: ObjectVersion;
  /** Format: dateTime */
  CreatedAt?: string;
  /** Format: dateTime */
  UpdatedAt?: string;
  Spec?: ConfigSpec;
}

/**
 * @description The version number of the object such as node, service, etc. This is needed
 * to avoid conflicting writes. The client must send the version number along
 * with the modified specification when updating these objects.
 *
 * This approach ensures safe concurrency and determinism in that the change
 * on the object may not be applied if the version number has changed from the
 * last read. In other words, if two update requests specify the same base
 * version, only one of the requests can succeed. As a result, two separate
 * update requests that happen at the same time will not unintentionally
 * overwrite each other.
 */
export interface ObjectVersion {
  /**
   * Format: uint64
   * @example 373531
   */
  Index?: number;
}

export interface ConfigSpec {
  /** @description User-defined name of the config. */
  Name: string;
  /** @description User-defined key/value metadata. */
  Labels?: { [key: string]: string };
  /**
   * @description Base64-url-safe-encoded ([RFC 4648](https://tools.ietf.org/html/rfc4648#section-5))
   * config data.
   */
  Data?: string;
  /**
   * @description Templating driver, if applicable
   *
   * Templating controls whether and how to evaluate the config payload as
   * a template. If no driver is set, no templating is used.
   */
  Templating?: Driver;
}

/** @description Driver represents a driver (network, logging, secrets). */
export interface Driver {
  /**
   * @description Name of the driver.
   * @example some-driver
   */
  Name: string;
  /**
   * @description Key/value map of driver-specific options.
   * @example {
   *   "OptionA": "value for driver-specific option A",
   *   "OptionB": "value for driver-specific option B"
   * }
   */
  Options?: { [key: string]: string };
}

export interface ConfigListParams {
  /**
   * A JSON encoded value of the filters (a `map[string][]string`) to
   * process on the configs list.
   *
   * Available filters:
   *
   * - `id=<config id>`
   * - `label=<key> or label=<key>=value`
   * - `name=<config name>`
   * - `names=<config name>`
   */
  filters?: {
    /** Config ID */
    id?: string[];
    /**
     * Matches volumes based on
     * the presence of a `label` alone or a `label` and a value.
     *
     * @example
     * label only: `["com.docker.compose.project", ...],`
     * label with value: `["com.docker.compose.project=projectname", ...],`
     */
    label?: string[];
    /**
     * Matches all or part of a config name.
     */
    name?: string[];
  };
}

export interface ConfigCreateParams {
  data: ConfigSpec;
}

export interface ConfigInspectParams {
  /** ID or name of the config */
  id: string;
}

export interface ConfigDeleteParams {
  /** ID or name of the config */
  id: string;
}

export interface ConfigUpdateParams {
  /** The ID or name of the config */
  id: string;
  /**
   * The version number of the config object being updated. This is
   * required to avoid conflicting writes.
   */
  version: number;
  /** Data to be updated */
  data: {
    /** @description User-defined key/value metadata. */
    Labels?: { [key: string]: string };
  };
}

export interface ConfigListResponse {
  configs?: Config[];
  error?: ErrorResponse;
}

export interface ConfigCreateResponse {
  configId?: IdResponse;
  error?: ErrorResponse;
}

export interface ConfigInspectResponse {
  config?: Config;
  error?: ErrorResponse;
}

export interface ConfigDeleteResponse {
  done: boolean;
  error?: ErrorResponse;
}

export interface ConfigUpdateResponse {
  done: boolean;
  error?: ErrorResponse;
}
