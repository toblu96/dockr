import { Got } from "got";
import {
  Port,
  SummaryNetworkSettings,
  MountPoint,
  ContainerListOptionsFilter,
  ErrorResponse,
  GotRequestError,
} from "../types/index.js";

export type ContainerListParams = {
  all?: boolean;
  limit?: number;
  size?: boolean;
  filters?: ContainerListOptionsFilter;
};
export interface ContainerInterface {
  /**
   * ## List Containers
   * Returns a list of containers. For details on the format, see the
   * [inspect endpoint](#operation/ContainerInspect).
   *
   * Note that it uses a different, smaller representation of a container
   * than inspecting a single container. For example, the list of linked
   * containers is not propagated .
   * @param params
   */
  list(params?: ContainerListParams): Promise<ContainerMethodResponse>;
  create(): Promise<ContainerCreateResponse | ErrorResponse>;
  inspect(): string;
  logs(): string;
}

export interface ContainerCreateResponse {
  Id: string;
  Warnings: string[];
}

interface ContainerMethodResponse {
  containers?: Container[];
  error?: ErrorResponse;
}

export function createContainerInterface(gotInstance: Got): ContainerInterface {
  const list = async function (
    params?: ContainerListParams
  ): Promise<ContainerMethodResponse> {
    try {
      return { containers: await gotInstance.get("containers/json").json() };
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
          _error.message = "Could not find any container";
          break;
      }
      return { error: _error };
    }
  };

  const container: ContainerInterface = {} as ContainerInterface;
  container.list = list;

  return container as ContainerInterface;
}
