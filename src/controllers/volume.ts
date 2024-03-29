import { Got } from "got";
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
  Volume,
  GotRequestError,
} from "../types/index.js";

export interface VolumeInterface {
  /**
   * List volumes
   * @param params JSON encoded value of the filters (a `map[string][]string`) to
          process on the volumes list. Available filters:

          - `dangling=<boolean>` When set to `true` (or `1`), returns all
             volumes that are not in use by a container. When set to `false`
             (or `0`), only volumes that are in use by one or more
             containers are returned.
          - `driver=<volume-driver-name>` Matches volumes based on their driver.
          - `label=<key>` or `label=<key>:<value>` Matches volumes based on
             the presence of a `label` alone or a `label` and a value.
          - `name=<volume-name>` Matches all or part of a volume name.
   * @returns Summary volume data that matches the query
   */
  list(params?: VolumeListParams): Promise<VolumeListResponse>;
  /**
   * Create a volume
   * @param params Volume configuration
   * @returns The volume was created successfully
   */
  create(params: VolumeCreateParams): Promise<VolumeCreateResponse>;
  /**
   * Inspect a volume
   * @param params Volume name or ID
   * @returns Volume data
   */
  inspect(params: VolumeInspectParams): Promise<VolumeInspectResponse>;
  /**
   * Delete unused volumes
   * @param params Filters to process on the prune list, encoded as JSON (a `map[string][]string`).

          Available filters:
          - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or `label!=<key>=<value>`) Prune volumes with (or without, in case `label!=...` is used) the specified labels.
   * @returns Volumes that were deleted, Disk space reclaimed in bytes
   */
  prune(params?: VolumePruneParams): Promise<VolumePruneResponse>;
  /**
   * Remove a volume
   *
   * Instruct the driver to remove the volume.
   * @param params
   *
   * @returns
   */
  delete(params: VolumeDeleteParams): Promise<VolumeDeleteResponse>;
}

interface ListVolumeResponseObject {
  Volumes: Volume[];
}

export function createVolumeInterface(gotInstance: Got): VolumeInterface {
  const volume: VolumeInterface = {} as VolumeInterface;

  volume.list = async function (
    params?: VolumeListParams
  ): Promise<VolumeListResponse> {
    // map filter params
    let filterObj: {
      dangling?: string[];
      driver?: string[];
      label?: string[];
      name?: string[];
    } = {};
    params?.filters?.dangling
      ? (filterObj.dangling = [`${params?.filters?.dangling}`])
      : "";
    params?.filters?.driver ? (filterObj.driver = params.filters.driver) : "";
    params?.filters?.label ? (filterObj.label = params.filters.label) : "";
    params?.filters?.name ? (filterObj.name = params.filters.name) : "";

    // list request
    try {
      let volumeObj: ListVolumeResponseObject = await gotInstance
        .get("volumes", {
          searchParams: {
            filters: JSON.stringify(filterObj),
          },
        })
        .json();
      return { volumes: volumeObj.Volumes };
    } catch (error) {
      const { response, message } = error as GotRequestError;

      // fill values for normal error cases
      let _error: ErrorResponse = {
        code: response?.statusCode || 500,
        message: response?.statusMessage || message,
        description: response?.body.message,
      };

      // handle special cases
      switch (response?.statusCode) {
        case 404:
          _error.message = "Could not find any volumes.";
          break;
      }
      return { error: _error };
    }
  };

  volume.create = async function (
    params: VolumeCreateParams
  ): Promise<VolumeCreateResponse> {
    // create request
    try {
      return {
        volume: await gotInstance
          .post("volumes/create", {
            json: params.data,
          })
          .json(),
      };
    } catch (error) {
      const { response, message } = error as GotRequestError;

      // fill values for normal error cases
      let _error: ErrorResponse = {
        code: response?.statusCode || 500,
        message: response?.statusMessage || message,
        description: response?.body.message,
      };

      return { error: _error };
    }
  };

  volume.inspect = async function (
    params: VolumeInspectParams
  ): Promise<VolumeInspectResponse> {
    // inspect request
    try {
      return {
        volume: await gotInstance.get(`volumes/${params?.name}`).json(),
      };
    } catch (error) {
      const { response, message } = error as GotRequestError;

      // fill values for normal error cases
      let _error: ErrorResponse = {
        code: response?.statusCode || 500,
        message: response?.statusMessage || message,
        description: response?.body.message,
      };

      // handle special cases
      switch (response?.statusCode) {
        case 404:
          _error.message = "No such volume.";
          break;
        case 500:
          _error.message = "Server error.";
          break;
      }
      return { error: _error };
    }
  };

  volume.prune = async function (
    params?: VolumePruneParams
  ): Promise<VolumePruneResponse> {
    // map filter params
    let filterObj: {
      label?: string[];
    } = {};
    params?.filters?.label ? (filterObj.label = params.filters.label) : "";

    // prune request
    try {
      return {
        volumes: await gotInstance
          .post("volumes/prune", {
            searchParams: {
              filters: JSON.stringify(filterObj),
            },
          })
          .json(),
      };
    } catch (error) {
      const { response, message } = error as GotRequestError;

      // fill values for normal error cases
      let _error: ErrorResponse = {
        code: response?.statusCode || 500,
        message: response?.statusMessage || message,
        description: response?.body.message,
      };

      return { error: _error };
    }
  };

  volume.delete = async function (
    params: VolumeDeleteParams
  ): Promise<VolumeDeleteResponse> {
    // delete request
    try {
      await gotInstance.delete(`volumes/${params.name}`, {
        searchParams: {
          force: params?.force,
        },
      });

      return { done: true };
    } catch (error) {
      const { response, message } = error as GotRequestError;

      // fill values for normal error cases
      let _error: ErrorResponse = {
        code: response?.statusCode || 500,
        message: response?.statusMessage || message,
        description: response?.body.message,
      };

      // handle special cases
      switch (response?.statusCode) {
        case 404:
          _error.message = "No such volume or volume driver.";
          break;
        case 409:
          _error.message = "Volume is in use and cannot be removed.";
          break;
        case 500:
          _error.message = "Server error.";
          break;
      }
      return { done: false, error: _error };
    }
  };

  return volume as VolumeInterface;
}
