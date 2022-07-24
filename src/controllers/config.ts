import { Got } from "got";
import {
  Config,
  ConfigCreateParams,
  ConfigCreateResponse,
  ConfigDeleteParams,
  ConfigDeleteResponse,
  ConfigInspectParams,
  ConfigInspectResponse,
  ConfigListParams,
  ConfigListResponse,
  ConfigUpdateParams,
  ConfigUpdateResponse,
  ErrorResponse,
  GotRequestError,
} from "../types/index.js";

export interface ConfigInterface {
  /**
   * List configs
   * @param params A JSON encoded value of the filters (a `map[string][]string`) to
            process on the configs list.

            Available filters:

            - `id=<config id>`
            - `label=<key> or label=<key>=value`
            - `name=<config name>`
            - `names=<config name>`
   * @returns Summary config data that matches the query
   */
  list(params?: ConfigListParams): Promise<ConfigListResponse>;
  /**
   * Create a config
   * @param params Config specification
   * @returns The id of the created config
   */
  create(params?: ConfigCreateParams): Promise<ConfigCreateResponse>;
  /**
   * Inspect a config
   * @param params Config id
   * @returns Config data
   */
  inspect(params: ConfigInspectParams): Promise<ConfigInspectResponse>;
  /**
   * Delete a config
   * @param params Config id
   * @returns done state
   */
  delete(params?: ConfigDeleteParams): Promise<ConfigDeleteResponse>;
  /**
   * Update a Config
   * @param params Id and version for identification, config data
   * Currently, only the Labels field can be updated. All other fields must remain unchanged from the ConfigInspect endpoint response values.
   * @returns done state
   */
  update(params?: ConfigUpdateParams): Promise<ConfigUpdateResponse>;
}

export function createConfigInterface(gotInstance: Got): ConfigInterface {
  const config: ConfigInterface = {} as ConfigInterface;

  config.list = async function (
    params?: ConfigListParams
  ): Promise<ConfigListResponse> {
    // map filter params
    let filterObj: {
      id?: string[];
      label?: string[];
      name?: string[];
    } = {};
    params?.filters?.id ? (filterObj.id = params.filters.id) : "";
    params?.filters?.label ? (filterObj.label = params.filters.label) : "";
    params?.filters?.name ? (filterObj.name = params.filters.name) : "";

    // list request
    try {
      let configObj: Config[] = await gotInstance
        .get("configs", {
          searchParams: {
            filters: JSON.stringify(filterObj),
          },
        })
        .json();

      return { configs: configObj };
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
        case 503:
          _error.message = "Node is not part of a swarm.";
          break;
      }
      return { error: _error };
    }
  };

  config.create = async function (
    params: ConfigCreateParams
  ): Promise<ConfigCreateResponse> {
    // create request
    try {
      // Encode data to Base64 string
      params.data.Data = Buffer.from(
        params.data.Data as string,
        "utf8"
      ).toString("base64");

      return {
        configId: await gotInstance
          .post("configs/create", {
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

      // handle special cases
      switch (response?.statusCode) {
        case 409:
          _error.message = "Name conflicts with an existing object.";
          break;
        case 500:
          _error.message = "Server error.";
          break;
        case 503:
          _error.message = "Node is not part of a swarm.";
          break;
      }

      return { error: _error };
    }
  };

  config.inspect = async function (
    params: ConfigInspectParams
  ): Promise<ConfigInspectResponse> {
    // inspect request
    try {
      return {
        config: await gotInstance.get(`configs/${params?.id}`).json(),
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
          _error.message = "Config not found.";
          break;
        case 500:
          _error.message = "Server error.";
          break;
        case 503:
          _error.message = "Node is not part of a swarm.";
          break;
      }
      return { error: _error };
    }
  };

  config.delete = async function (
    params: ConfigDeleteParams
  ): Promise<ConfigDeleteResponse> {
    // delete request
    try {
      await gotInstance.delete(`configs/${params.id}`);

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
          _error.message = "Config not found.";
          break;
        case 500:
          _error.message = "Server error.";
          break;
        case 503:
          _error.message = "Node is not part of a swarm.";
          break;
      }
      return { done: false, error: _error };
    }
  };

  //TODO: Currently not able to update a label - Error: 'rpc error: code = InvalidArgument desc = only updates to Labels are allowed'
  config.update = async function (
    params: ConfigUpdateParams
  ): Promise<ConfigUpdateResponse> {
    // update request
    try {
      await gotInstance.post(`configs/${params.id}/update`, {
        searchParams: {
          version: params?.version,
        },
        json: params.data,
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
        case 400:
          _error.message = "Bad parameter.";
          break;
        case 404:
          _error.message = "No such config.";
          break;
        case 500:
          _error.message = "Server error.";
          break;
        case 503:
          _error.message = "Node is not part of a swarm.";
          break;
      }
      return { done: false, error: _error };
    }
  };

  return config as ConfigInterface;
}
