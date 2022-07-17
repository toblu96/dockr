import { ErrorResponse } from "./index.js";

export interface Volume {
  /**
   * @description Name of the volume.
   * @example tardis
   */
  Name: string;
  /**
   * @description Name of the volume driver used by the volume.
   * @example custom
   */
  Driver: string;
  /**
   * @description Mount path of the volume on the host.
   * @example /var/lib/docker/volumes/tardis
   */
  Mountpoint: string;
  /**
   * Format: dateTime
   * @description Date/Time the volume was created.
   * @example 2016-06-07T20:31:11.853781916Z
   */
  CreatedAt?: string;
  /**
   * @description Low-level details about the volume, provided by the volume driver.
   * Details are returned as a map with key/value pairs:
   * `{"key":"value","key2":"value2"}`.
   *
   * The `Status` field is optional, and is omitted if the volume driver
   * does not support this feature.
   *
   * @example {
   *   "hello": "world"
   * }
   */
  Status?: { [key: string]: { [key: string]: unknown } };
  /**
   * @description User-defined key/value metadata.
   * @example {
   *   "com.example.some-label": "some-value",
   *   "com.example.some-other-label": "some-other-value"
   * }
   */
  Labels: { [key: string]: string };
  /**
   * @description The level at which the volume exists. Either `global` for cluster-wide,
   * or `local` for machine level.
   *
   * @default local
   * @example local
   * @enum {string}
   */
  Scope: "local" | "global";
  /**
   * @description The driver specific options used when creating the volume.
   *
   * @example {
   *   "device": "tmpfs",
   *   "o": "size=100m,uid=1000",
   *   "type": "tmpfs"
   * }
   */
  Options: { [key: string]: string };
  /**
   * @description Usage details about the volume. This information is used by the
   * `GET /system/df` endpoint, and omitted in other endpoints.
   */
  UsageData?: {
    /**
     * @description Amount of disk space used by the volume (in bytes). This information
     * is only available for volumes created with the `"local"` volume
     * driver. For volumes created with other volume drivers, this field
     * is set to `-1` ("not available")
     *
     * @default -1
     */
    Size: number;
    /**
     * @description The number of containers referencing this volume. This field
     * is set to `-1` if the reference-count is not available.
     *
     * @default -1
     */
    RefCount: number;
  };
}

export interface VolumeListParams {
  /**
   * JSON encoded value of the filters (a `map[string][]string`) to
   * process on the volumes list. Available filters:
   *
   * - `dangling=<boolean>` When set to `true` (or `1`), returns all
   *    volumes that are not in use by a container. When set to `false`
   *    (or `0`), only volumes that are in use by one or more
   *    containers are returned.
   * - `driver=<volume-driver-name>` Matches volumes based on their driver.
   * - `label=<key>` or `label=<key>:<value>` Matches volumes based on
   *    the presence of a `label` alone or a `label` and a value.
   * - `name=<volume-name>` Matches all or part of a volume name.
   */
  filters?: {
    /**
     * When set to `true` (or `1`), returns all
     * volumes that are not in use by a container. When set to `false`
     * (or `0`), only volumes that are in use by one or more
     * containers are returned.
     */
    dangling?: true | false;
    /**
     * Matches volumes based on their driver.
     */
    driver?: string[];
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
     * Matches all or part of a volume name.
     */
    name?: string[];
  };
}

export interface VolumeInspectParams {
  /** Volume name or ID */
  name: string;
}

export interface VolumeDeleteParams {
  /** Volume name or ID */
  name: string;
  /** Force the removal of the volume */
  force?: boolean;
}

export interface VolumePruneParams {
  /**
   * Filters to process on the prune list, encoded as JSON (a `map[string][]string`).
   *
   * Available filters:
   * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or `label!=<key>=<value>`) Prune volumes with (or without, in case `label!=...` is used) the specified labels.
   */
  filters?: {
    /**
     * Matches volumes based on
     * the presence of a `label` alone or a `label` and a value.
     *
     * @example
     * label only: `["com.docker.compose.project", ...],`
     * label with value: `["com.docker.compose.project=projectname", ...],`
     */
    label?: string[];
  };
}

export interface VolumeCreateParams {
  /** Volume configuration */
  data: VolumeCreateOptions;
}

/**
 * VolumeConfig
 * @description Volume configuration
 */
export interface VolumeCreateOptions {
  /**
   * @description The new volume's name. If not specified, Docker generates a name.
   *
   * @example tardis
   */
  Name?: string;
  /**
   * @description Name of the volume driver to use.
   * @default local
   * @example custom
   */
  Driver?: string;
  /**
   * @description A mapping of driver options and values. These options are
   * passed directly to the driver and are driver specific.
   *
   * @example {
   *   "device": "tmpfs",
   *   "o": "size=100m,uid=1000",
   *   "type": "tmpfs"
   * }
   */
  DriverOpts?: { [key: string]: string };
  /**
   * @description User-defined key/value metadata.
   * @example {
   *   "com.example.some-label": "some-value",
   *   "com.example.some-other-label": "some-other-value"
   * }
   */
  Labels?: { [key: string]: string };
}

export interface VolumeListResponse {
  volumes?: Volume[];
  error?: ErrorResponse;
}

export interface VolumeCreateResponse {
  volume?: Volume;
  error?: ErrorResponse;
}

export interface VolumeInspectResponse {
  volume?: Volume;
  error?: ErrorResponse;
}

export interface VolumeDeleteResponse {
  done: boolean;
  error?: ErrorResponse;
}

export interface VolumePruneResponse {
  volumes?: {
    /** @description Volumes that were deleted */
    VolumesDeleted?: string[];
    /**
     * Format: int64
     * @description Disk space reclaimed in bytes
     */
    SpaceReclaimed?: number;
  };
  error?: ErrorResponse;
}
