import { Got, RequestError } from "got";
import {
  VolumeListParams,
  ErrorResponse,
  VolumeCreateParams,
  VolumeInspectParams,
  VolumePruneParams,
  VolumeDeleteParams,
  VolumeCreateResponse,
  VolumeDeleteResponse,
  VolumeInspectResponse,
  VolumeListResponse,
  VolumePruneResponse,
} from "../types/index.js";

export interface VolumeInterface {
  list(params?: VolumeListParams): Promise<VolumeListResponse>;
  create(params?: VolumeCreateParams): Promise<VolumeCreateResponse>;
  inspect(params?: VolumeInspectParams): Promise<VolumeInspectResponse>;
  prune(params?: VolumePruneParams): Promise<VolumePruneResponse>;
  delete(params?: VolumeDeleteParams): Promise<VolumeDeleteResponse>;
}

export function createVolumeInterface(gotInstance: Got): VolumeInterface {
  /**
   * List volumes
   * @param params Filter params
   * @returns Summary volume data that matches the query
   */
  const _list = async function (
    params?: VolumeListParams
  ): Promise<VolumeListResponse> {
    // TODO: implement filters
    try {
      return { volumes: await gotInstance.get("containers/json").json() };
    } catch (error) {
      const { response, message } = error as RequestError;

      // fill values for normal error cases
      let _error: ErrorResponse = {
        code: response?.statusCode || 500,
        message: response?.statusMessage || message,
      };

      // handle special cases
      switch (response?.statusCode) {
        case 404:
          _error.message = "Could not find any container";
          break;
      }
      return { error: _error };
    }
  };

  /**
   * Create a volume
   * @param params Volume configuration
   * @returns The volume was created successfully
   */
  const _create = async function (
    params?: VolumeCreateParams
  ): Promise<VolumeCreateResponse> {
    // TODO: add logic
    return { volumes: undefined };
  };

  /**
   * Inspect a volume
   * @param params Volume name or ID
   * @returns Volume data
   */
  const _inspect = async function (
    params?: VolumeInspectParams
  ): Promise<VolumeInspectResponse> {
    // TODO: add logic
    return { volumes: undefined };
  };

  /**
   * Delete unused volumes
   * @param params Filters to process on the prune list, encoded as JSON (a `map[string][]string`).

          Available filters:
          - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or `label!=<key>=<value>`) Prune volumes with (or without, in case `label!=...` is used) the specified labels.
   * @returns Volumes that were deleted, Disk space reclaimed in bytes
   */
  const _prune = async function (
    params?: VolumePruneParams
  ): Promise<VolumePruneResponse> {
    // TODO: add logic
    return { volumes: undefined };
  };

  /**
   * Remove a volume
   *
   * Instruct the driver to remove the volume.
   * @param params
   *
   * @returns
   */
  const _delete = async function (
    params?: VolumeDeleteParams
  ): Promise<VolumeDeleteResponse> {
    // TODO: add logic
    return { done: false };
  };

  const volume: VolumeInterface = {} as VolumeInterface;
  volume.list = _list;
  volume.create = _create;
  volume.inspect = _inspect;
  volume.prune = _prune;
  volume.delete = _delete;

  return volume as VolumeInterface;
}
