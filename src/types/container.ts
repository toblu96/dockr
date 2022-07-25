import {
  EndpointSettings,
  ErrorResponse,
  IdResponse,
  MountPoint,
  Port,
  SummaryNetworkSettings,
} from "./index.js";

export interface Container {
  /** @description The ID of this container */
  Id?: string;
  /** @description The names that this container has been given */
  Names?: string[];
  /** @description The name of the image used when creating this container */
  Image?: string;
  /** @description The ID of the image that this container was created from */
  ImageID?: string;
  /** @description Command to run when starting the container */
  Command?: string;
  /**
   * Format: int64
   * @description When the container was created
   */
  Created?: number;
  /** @description The ports exposed by this container */
  Ports?: Port[];
  /**
   * Format: int64
   * @description The size of files that have been created or changed by this container
   */
  SizeRw?: number;
  /**
   * Format: int64
   * @description The total size of all the files in this container
   */
  SizeRootFs?: number;
  /** @description User-defined key/value metadata. */
  Labels?: { [key: string]: string };
  /** @description The state of this container (e.g. `Exited`) */
  State?: string;
  /** @description Additional human-readable status of this container (e.g. `Exit 0`) */
  Status?: string;
  HostConfig?: {
    NetworkMode?: string;
  };
  /** @description A summary of the container's network settings */
  NetworkSettings?: SummaryNetworkSettings;
  Mounts?: MountPoint[];
}

export interface ContainerListParams {
  /** Return the size of container as fields `SizeRw` and `SizeRootFs`. */
  size?: boolean;
  /** Return all containers. By default, only running containers are shown. */
  all?: boolean;
  /** Return this number of most recently created containers, including non-running ones. */
  limit?: number;
  /**
   * Filters to process on the container list, encoded as JSON (a
   * `map[string][]string`). For example, `{"status": ["paused"]}` will
   *   only return paused containers.
   *
   * Available filters:
   *
   * - `ancestor`=(`<image-name>[:<tag>]`, `<image id>`, or `<image@digest>`)
   * - `before`=(`<container id>` or `<container name>`)
   * - `expose`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`)
   * - `exited=<int>` containers with exit code of `<int>`
   * - `health`=(`starting`|`healthy`|`unhealthy`|`none`)
   * - `id=<ID>` a container's ID
   * - `isolation=`(`default`|`process`|`hyperv`) (Windows daemon only)
   * - `is-task=`(`true`|`false`)
   * - `label=key` or `label="key=value"` of a container label
   * - `name=<name>` a container's name
   * - `network`=(`<network id>` or `<network name>`)
   * - `publish`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`)
   * - `since`=(`<container id>` or `<container name>`)
   * - `status=`(`created`|`restarting`|`running`|`removing`|`paused`|`exited`|`dead`)
   * - `volume`=(`<volume name>` or `<mount point destination>`)
   */
  filters?: ContainerListOptionsFilter;
}

// TODO: add additional filter params
export interface ContainerListOptionsFilter {
  /** A container's ID */
  id: string[];
  /** A container's name */
  name: string[];
  status: Array<
    | `created`
    | `restarting`
    | `running`
    | `removing`
    | `paused`
    | `exited`
    | `dead`
  >;
  /** `<volume name>` or `<mount point destination>` */
  volume: string[];
}

export interface ContainerListResponse {
  containers?: Container[];
  error?: ErrorResponse;
}

/** @description Configuration for a container that is portable between hosts. */
type ContainerConfig = {
  /**
   * @description The hostname to use for the container, as a valid RFC 1123 hostname.
   *
   * @example 439f4e91bd1d
   */
  Hostname?: string;
  /** @description The domain name to use for the container. */
  Domainname?: string;
  /** @description The user that commands are run as inside the container. */
  User?: string;
  /**
   * @description Whether to attach to `stdin`.
   * @default false
   */
  AttachStdin?: boolean;
  /**
   * @description Whether to attach to `stdout`.
   * @default true
   */
  AttachStdout?: boolean;
  /**
   * @description Whether to attach to `stderr`.
   * @default true
   */
  AttachStderr?: boolean;
  /**
   * @description An object mapping ports to an empty object in the form:
   *
   * `{"<port>/<tcp|udp|sctp>": {}}`
   *
   * @example {
   *   "80/tcp": {},
   *   "443/tcp": {}
   * }
   */
  ExposedPorts?: { [key: string]: {} };
  /**
   * @description Attach standard streams to a TTY, including `stdin` if it is not closed.
   *
   * @default false
   */
  Tty?: boolean;
  /**
   * @description Open `stdin`
   * @default false
   */
  OpenStdin?: boolean;
  /**
   * @description Close `stdin` after one attached client disconnects
   * @default false
   */
  StdinOnce?: boolean;
  /**
   * @description A list of environment variables to set inside the container in the
   * form `["VAR=value", ...]`. A variable without `=` is removed from the
   * environment, rather than to have an empty value.
   *
   * @example [
   *   "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
   * ]
   */
  Env?: string[];
  /**
   * @description Command to run specified as a string or an array of strings.
   *
   * @example [
   *   "/bin/sh"
   * ]
   */
  Cmd?: string[];
  Healthcheck?: HealthConfig;
  /**
   * @description Command is already escaped (Windows only)
   * @default false
   * @example false
   */
  ArgsEscaped?: boolean;
  /**
   * @description The name (or reference) of the image to use when creating the container,
   * or which was used when the container was created.
   *
   * @example example-image:1.0
   */
  Image?: string;
  /**
   * @description An object mapping mount point paths inside the container to empty
   * objects.
   */
  Volumes?: { [key: string]: {} };
  /**
   * @description The working directory for commands to run in.
   * @example /public/
   */
  WorkingDir?: string;
  /**
   * @description The entry point for the container as a string or an array of strings.
   *
   * If the array consists of exactly one empty string (`[""]`) then the
   * entry point is reset to system default (i.e., the entry point used by
   * docker when there is no `ENTRYPOINT` instruction in the `Dockerfile`).
   *
   * @example []
   */
  Entrypoint?: string[];
  /** @description Disable networking for the container. */
  NetworkDisabled?: boolean;
  /** @description MAC address of the container. */
  MacAddress?: string;
  /**
   * @description `ONBUILD` metadata that were defined in the image's `Dockerfile`.
   *
   * @example []
   */
  OnBuild?: string[];
  /**
   * @description User-defined key/value metadata.
   * @example {
   *   "com.example.some-label": "some-value",
   *   "com.example.some-other-label": "some-other-value"
   * }
   */
  Labels?: { [key: string]: string };
  /**
   * @description Signal to stop a container as a string or unsigned integer.
   *
   * @example SIGTERM
   */
  StopSignal?: string;
  /**
   * @description Timeout to stop a container in seconds.
   * @default 10
   */
  StopTimeout?: number;
  /**
   * @description Shell for when `RUN`, `CMD`, and `ENTRYPOINT` uses a shell.
   *
   * @example [
   *   "/bin/sh",
   *   "-c"
   * ]
   */
  Shell?: string[];
};

/** @description A test to perform to check that the container is healthy. */
type HealthConfig = {
  /**
   * @description The test to perform. Possible values are:
   *
   * - `[]` inherit healthcheck from image or parent image
   * - `["NONE"]` disable healthcheck
   * - `["CMD", args...]` exec arguments directly
   * - `["CMD-SHELL", command]` run command with system's default shell
   */
  Test?: string[];
  /**
   * @description The time to wait between checks in nanoseconds. It should be 0 or at
   * least 1000000 (1 ms). 0 means inherit.
   */
  Interval?: number;
  /**
   * @description The time to wait before considering the check to have hung. It should
   * be 0 or at least 1000000 (1 ms). 0 means inherit.
   */
  Timeout?: number;
  /**
   * @description The number of consecutive failures needed to consider a container as
   * unhealthy. 0 means inherit.
   */
  Retries?: number;
  /**
   * @description Start period for the container to initialize before starting
   * health-retries countdown in nanoseconds. It should be 0 or at least
   * 1000000 (1 ms). 0 means inherit.
   */
  StartPeriod?: number;
};

export interface ContainerCreateParams {
  /**
   * Assign the specified name to the container. Must match
   * `/?[a-zA-Z0-9][a-zA-Z0-9_.-]+`.
   * */
  name: string;
  /** Configuration for a container that is portable between hosts. */
  data: ContainerConfig;
}

export interface ContainerCreateResponse {
  containers?: Container[];
  error?: ErrorResponse;
}

export interface ContainerInspectParams {
  /** ID or name of the container */
  id: string;
  /** Return the size of container as fields `SizeRw` and `SizeRootFs` */
  size?: boolean;
}

interface ContainerState {
  /**
   * @description String representation of the container state. Can be one of "created",
   * "running", "paused", "restarting", "removing", "exited", or "dead".
   *
   * @example running
   * @enum {string}
   */
  Status?:
    | "created"
    | "running"
    | "paused"
    | "restarting"
    | "removing"
    | "exited"
    | "dead";
  /**
   * @description Whether this container is running.
   *
   * Note that a running container can be _paused_. The `Running` and `Paused`
   * booleans are not mutually exclusive:
   *
   * When pausing a container (on Linux), the freezer cgroup is used to suspend
   * all processes in the container. Freezing the process requires the process to
   * be running. As a result, paused containers are both `Running` _and_ `Paused`.
   *
   * Use the `Status` field instead to determine if a container's state is "running".
   *
   * @example true
   */
  Running?: boolean;
  /**
   * @description Whether this container is paused.
   * @example false
   */
  Paused?: boolean;
  /**
   * @description Whether this container is restarting.
   * @example false
   */
  Restarting?: boolean;
  /**
   * @description Whether this container has been killed because it ran out of memory.
   *
   * @example false
   */
  OOMKilled?: boolean;
  /** @example false */
  Dead?: boolean;
  /**
   * @description The process ID of this container
   * @example 1234
   */
  Pid?: number;
  /**
   * @description The last exit code of this container
   * @example 0
   */
  ExitCode?: number;
  Error?: string;
  /**
   * @description The time when this container was last started.
   * @example 2020-01-06T09:06:59.461876391Z
   */
  StartedAt?: string;
  /**
   * @description The time when this container last exited.
   * @example 2020-01-06T09:07:59.461876391Z
   */
  FinishedAt?: string;
  Health?: Health;
}

/** @description Health stores information about the container's healthcheck results. */
interface Health {
  /**
   * @description Status is one of `none`, `starting`, `healthy` or `unhealthy`
   *
   * - "none"      Indicates there is no healthcheck
   * - "starting"  Starting indicates that the container is not yet ready
   * - "healthy"   Healthy indicates that the container is running correctly
   * - "unhealthy" Unhealthy indicates that the container has a problem
   *
   * @example healthy
   * @enum {string}
   */
  Status?: "none" | "starting" | "healthy" | "unhealthy";
  /**
   * @description FailingStreak is the number of consecutive failures
   * @example 0
   */
  FailingStreak?: number;
  /** @description Log contains the last few results (oldest first) */
  Log?: HealthcheckResult[];
}

/** @description HealthcheckResult stores information about a single run of a healthcheck probe */
interface HealthcheckResult {
  /**
   * Format: date-time
   * @description Date and time at which this check started in
   * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
   *
   * @example 2020-01-04T10:44:24.496525531Z
   */
  Start?: string;
  /**
   * Format: dateTime
   * @description Date and time at which this check ended in
   * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
   *
   * @example 2020-01-04T10:45:21.364524523Z
   */
  End?: string;
  /**
   * @description ExitCode meanings:
   *
   * - `0` healthy
   * - `1` unhealthy
   * - `2` reserved (considered unhealthy)
   * - other values: error running probe
   *
   * @example 0
   */
  ExitCode?: number;
  /** @description Output from last check */
  Output?: string;
}

/**
 * @description An object describing the resources which can be advertised by a node and
 * requested by a task.
 */
interface ResourceObject {
  /**
   * Format: int64
   * @example 4000000000
   */
  NanoCPUs?: number;
  /**
   * Format: int64
   * @example 8272408576
   */
  MemoryBytes?: number;
  GenericResources?: GenericResources;
}

/**
 * @description User-defined resources can be either Integer resources (e.g, `SSD=3`) or
 * String resources (e.g, `GPU=UUID1`).
 *
 * @example [
 *   {
 *     "DiscreteResourceSpec": {
 *       "Kind": "SSD",
 *       "Value": 3
 *     }
 *   },
 *   {
 *     "NamedResourceSpec": {
 *       "Kind": "GPU",
 *       "Value": "UUID1"
 *     }
 *   },
 *   {
 *     "NamedResourceSpec": {
 *       "Kind": "GPU",
 *       "Value": "UUID2"
 *     }
 *   }
 * ]
 */
interface GenericResources {
  NamedResourceSpec?: {
    Kind?: string;
    Value?: string;
  };
  DiscreteResourceSpec?: {
    Kind?: string;
    /** Format: int64 */
    Value?: number;
  };
}

/** @description An object describing a limit on resources which can be requested by a task. */
interface Limit {
  /**
   * Format: int64
   * @example 4000000000
   */
  NanoCPUs?: number;
  /**
   * Format: int64
   * @example 8272408576
   */
  MemoryBytes?: number;
  /**
   * Format: int64
   * @description Limits the maximum number of PIDs in the container. Set `0` for unlimited.
   *
   * @default 0
   * @example 100
   */
  Pids?: number;
}

/**
 * @description Resource requirements which apply to each individual container created
 * as part of the service.
 */
interface Resources {
  /** @description Define resources limits. */
  Limits?: Limit;
  /** @description Define resources reservation. */
  Reservations?: ResourceObject;
}

/**
 * @description PortMap describes the mapping of container ports to host ports, using the
 * container's port-number and protocol as key in the format `<port>/<protocol>`,
 * for example, `80/udp`.
 *
 * If a container's port is mapped for multiple protocols, separate entries
 * are added to the mapping table.
 *
 * @example {
 *   "443/tcp": [
 *     {
 *       "HostIp": "127.0.0.1",
 *       "HostPort": "4443"
 *     }
 *   ],
 *   "80/tcp": [
 *     {
 *       "HostIp": "0.0.0.0",
 *       "HostPort": "80"
 *     },
 *     {
 *       "HostIp": "0.0.0.0",
 *       "HostPort": "8080"
 *     }
 *   ],
 *   "80/udp": [
 *     {
 *       "HostIp": "0.0.0.0",
 *       "HostPort": "80"
 *     }
 *   ],
 *   "53/udp": [
 *     {
 *       "HostIp": "0.0.0.0",
 *       "HostPort": "53"
 *     }
 *   ],
 *   "2377/tcp": null
 * }
 */
interface PortMap {
  [key: string]: PortBinding[];
}

/**
 * @description PortBinding represents a binding between a host IP address and a host
 * port.
 */
interface PortBinding {
  /**
   * @description Host IP address that the container's port is mapped to.
   * @example 127.0.0.1
   */
  HostIp?: string;
  /**
   * @description Host port number that the container's port is mapped to.
   * @example 4443
   */
  HostPort?: string;
}

/**
 * @description Specification for the restart policy which applies to containers
 * created as part of this service.
 */
interface RestartPolicy {
  /**
   * @description Condition for restart.
   * @enum {string}
   */
  Condition?: "none" | "on-failure" | "any";
  /**
   * Format: int64
   * @description Delay between restart attempts.
   */
  Delay?: number;
  /**
   * Format: int64
   * @description Maximum attempts to restart a given container before giving up
   * (default value is 0, which is ignored).
   *
   * @default 0
   */
  MaxAttempts?: number;
  /**
   * Format: int64
   * @description Windows is the time window used to evaluate the restart policy
   * (default value is 0, which is unbounded).
   *
   * @default 0
   */
  Window?: number;
}

interface Mount {
  /** @description Container path. */
  Target?: string;
  /** @description Mount source (e.g. a volume name, a host path). */
  Source?: string;
  /**
   * @description The mount type. Available types:
   *
   * - `bind` Mounts a file or directory from the host into the container. Must exist prior to creating the container.
   * - `volume` Creates a volume with the given name and options (or uses a pre-existing volume with the same name and options). These are **not** removed when the container is removed.
   * - `tmpfs` Create a tmpfs with the given options. The mount source cannot be specified for tmpfs.
   * - `npipe` Mounts a named pipe from the host into the container. Must exist prior to creating the container.
   *
   * @enum {string}
   */
  Type?: "bind" | "volume" | "tmpfs" | "npipe";
  /** @description Whether the mount should be read-only. */
  ReadOnly?: boolean;
  /** @description The consistency requirement for the mount: `default`, `consistent`, `cached`, or `delegated`. */
  Consistency?: string;
  /** @description Optional configuration for the `bind` type. */
  BindOptions?: {
    /**
     * @description A propagation mode with the value `[r]private`, `[r]shared`, or `[r]slave`.
     * @enum {string}
     */
    Propagation?:
      | "private"
      | "rprivate"
      | "shared"
      | "rshared"
      | "slave"
      | "rslave";
    /**
     * @description Disable recursive bind mount.
     * @default false
     */
    NonRecursive?: boolean;
  };
  /** @description Optional configuration for the `volume` type. */
  VolumeOptions?: {
    /**
     * @description Populate volume with data from the target.
     * @default false
     */
    NoCopy?: boolean;
    /** @description User-defined key/value metadata. */
    Labels?: { [key: string]: string };
    /** @description Map of driver specific options */
    DriverConfig?: {
      /** @description Name of the driver to use to create the volume. */
      Name?: string;
      /** @description key/value map of driver specific options. */
      Options?: { [key: string]: string };
    };
  };
  /** @description Optional configuration for the `tmpfs` type. */
  TmpfsOptions?: {
    /**
     * Format: int64
     * @description The size for the tmpfs mount in bytes.
     */
    SizeBytes?: number;
    /** @description The permission mode for the tmpfs mount in an integer. */
    Mode?: number;
  };
}

/** @description Address represents an IPv4 or IPv6 IP address. */
interface Address {
  /** @description IP address. */
  Addr?: string;
  /** @description Mask length of the IP address. */
  PrefixLen?: number;
}

/**
 * @description Information about the storage driver used to store the container's and
 * image's filesystem.
 */
interface GraphDriverData {
  /**
   * @description Name of the storage driver.
   * @example overlay2
   */
  Name: string;
  /**
   * @description Low-level storage metadata, provided as key/value pairs.
   *
   * This information is driver-specific, and depends on the storage-driver
   * in use, and should be used for informational purposes only.
   *
   * @example {
   *   "MergedDir": "/var/lib/docker/overlay2/ef749362d13333e65fc95c572eb525abbe0052e16e086cb64bc3b98ae9aa6d74/merged",
   *   "UpperDir": "/var/lib/docker/overlay2/ef749362d13333e65fc95c572eb525abbe0052e16e086cb64bc3b98ae9aa6d74/diff",
   *   "WorkDir": "/var/lib/docker/overlay2/ef749362d13333e65fc95c572eb525abbe0052e16e086cb64bc3b98ae9aa6d74/work"
   * }
   */
  Data: { [key: string]: string };
}

/** @description NetworkSettings exposes the network settings in the API */
interface NetworkSettings {
  /**
   * @description Name of the network'a bridge (for example, `docker0`).
   * @example docker0
   */
  Bridge?: string;
  /**
   * @description SandboxID uniquely represents a container's network stack.
   * @example 9d12daf2c33f5959c8bf90aa513e4f65b561738661003029ec84830cd503a0c3
   */
  SandboxID?: string;
  /**
   * @description Indicates if hairpin NAT should be enabled on the virtual interface.
   *
   * @example false
   */
  HairpinMode?: boolean;
  /**
   * @description IPv6 unicast address using the link-local prefix.
   * @example fe80::42:acff:fe11:1
   */
  LinkLocalIPv6Address?: string;
  /**
   * @description Prefix length of the IPv6 unicast address.
   * @example 64
   */
  LinkLocalIPv6PrefixLen?: number;
  Ports?: PortMap;
  /**
   * @description SandboxKey identifies the sandbox
   * @example /var/run/docker/netns/8ab54b426c38
   */
  SandboxKey?: string;
  SecondaryIPAddresses?: Address[];
  SecondaryIPv6Addresses?: Address[];
  /**
   * @description EndpointID uniquely represents a service endpoint in a Sandbox.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   *
   * @example b88f5b905aabf2893f3cbc4ee42d1ea7980bbc0a92e2c8922b1e1795298afb0b
   */
  EndpointID?: string;
  /**
   * @description Gateway address for the default "bridge" network.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   *
   * @example 172.17.0.1
   */
  Gateway?: string;
  /**
   * @description Global IPv6 address for the default "bridge" network.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   *
   * @example 2001:db8::5689
   */
  GlobalIPv6Address?: string;
  /**
   * @description Mask length of the global IPv6 address.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   *
   * @example 64
   */
  GlobalIPv6PrefixLen?: number;
  /**
   * @description IPv4 address for the default "bridge" network.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   *
   * @example 172.17.0.4
   */
  IPAddress?: string;
  /**
   * @description Mask length of the IPv4 address.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   *
   * @example 16
   */
  IPPrefixLen?: number;
  /**
   * @description IPv6 gateway address for this network.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   *
   * @example 2001:db8:2::100
   */
  IPv6Gateway?: string;
  /**
   * @description MAC address for the container on the default "bridge" network.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   *
   * @example 02:42:ac:11:00:04
   */
  MacAddress?: string;
  /** @description Information about all networks that the container is connected to. */
  Networks?: { [key: string]: EndpointSettings };
}

/** @description Container configuration that depends on the host we are running on */
interface HostConfig extends Resources {
  /**
   * @description A list of volume bindings for this container. Each volume binding
   * is a string in one of these forms:
   *
   * - `host-src:container-dest[:options]` to bind-mount a host path
   *   into the container. Both `host-src`, and `container-dest` must
   *   be an _absolute_ path.
   * - `volume-name:container-dest[:options]` to bind-mount a volume
   *   managed by a volume driver into the container. `container-dest`
   *   must be an _absolute_ path.
   *
   * `options` is an optional, comma-delimited list of:
   *
   * - `nocopy` disables automatic copying of data from the container
   *   path to the volume. The `nocopy` flag only applies to named volumes.
   * - `[ro|rw]` mounts a volume read-only or read-write, respectively.
   *   If omitted or set to `rw`, volumes are mounted read-write.
   * - `[z|Z]` applies SELinux labels to allow or deny multiple containers
   *   to read and write to the same volume.
   *     - `z`: a _shared_ content label is applied to the content. This
   *       label indicates that multiple containers can share the volume
   *       content, for both reading and writing.
   *     - `Z`: a _private unshared_ label is applied to the content.
   *       This label indicates that only the current container can use
   *       a private volume. Labeling systems such as SELinux require
   *       proper labels to be placed on volume content that is mounted
   *       into a container. Without a label, the security system can
   *       prevent a container's processes from using the content. By
   *       default, the labels set by the host operating system are not
   *       modified.
   * - `[[r]shared|[r]slave|[r]private]` specifies mount
   *   [propagation behavior](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt).
   *   This only applies to bind-mounted volumes, not internal volumes
   *   or named volumes. Mount propagation requires the source mount
   *   point (the location where the source directory is mounted in the
   *   host operating system) to have the correct propagation properties.
   *   For shared volumes, the source mount point must be set to `shared`.
   *   For slave volumes, the mount must be set to either `shared` or
   *   `slave`.
   */
  Binds?: string[];
  /** @description Path to a file where the container ID is written */
  ContainerIDFile?: string;
  /** @description The logging configuration for this container */
  LogConfig?: {
    /** @enum {string} */
    Type?:
      | "json-file"
      | "syslog"
      | "journald"
      | "gelf"
      | "fluentd"
      | "awslogs"
      | "splunk"
      | "etwlogs"
      | "none";
    Config?: { [key: string]: string };
  };

  /**
   * @description Network mode to use for this container. Supported standard values
   * are: `bridge`, `host`, `none`, and `container:<name|id>`. Any
   * other value is taken as a custom network's name to which this
   * container should connect to.
   */
  NetworkMode?: string;
  PortBindings?: PortMap;
  RestartPolicy?: RestartPolicy;
  /**
   * @description Automatically remove the container when the container's process
   * exits. This has no effect if `RestartPolicy` is set.
   */
  AutoRemove?: boolean;
  /** @description Driver that this container uses to mount volumes. */
  VolumeDriver?: string;
  /**
   * @description A list of volumes to inherit from another container, specified in
   * the form `<container name>[:<ro|rw>]`.
   */
  VolumesFrom?: string[];
  /** @description Specification for mounts to be added to the container. */
  Mounts?: Mount[];
  /**
   * @description A list of kernel capabilities to add to the container. Conflicts
   * with option 'Capabilities'.
   */
  CapAdd?: string[];
  /**
   * @description A list of kernel capabilities to drop from the container. Conflicts
   * with option 'Capabilities'.
   */
  CapDrop?: string[];
  /**
   * @description cgroup namespace mode for the container. Possible values are:
   *
   * - `"private"`: the container runs in its own private cgroup namespace
   * - `"host"`: use the host system's cgroup namespace
   *
   * If not specified, the daemon default is used, which can either be `"private"`
   * or `"host"`, depending on daemon version, kernel support and configuration.
   *
   * @enum {string}
   */
  CgroupnsMode?: "private" | "host";
  /** @description A list of DNS servers for the container to use. */
  Dns?: string[];
  /** @description A list of DNS options. */
  DnsOptions?: string[];
  /** @description A list of DNS search domains. */
  DnsSearch?: string[];
  /**
   * @description A list of hostnames/IP mappings to add to the container's `/etc/hosts`
   * file. Specified in the form `["hostname:IP"]`.
   */
  ExtraHosts?: string[];
  /** @description A list of additional groups that the container process will run as. */
  GroupAdd?: string[];
  /**
   * @description IPC sharing mode for the container. Possible values are:
   *
   * - `"none"`: own private IPC namespace, with /dev/shm not mounted
   * - `"private"`: own private IPC namespace
   * - `"shareable"`: own private IPC namespace, with a possibility to share it with other containers
   * - `"container:<name|id>"`: join another (shareable) container's IPC namespace
   * - `"host"`: use the host system's IPC namespace
   *
   * If not specified, daemon default is used, which can either be `"private"`
   * or `"shareable"`, depending on daemon version and configuration.
   */
  IpcMode?: string;
  /** @description Cgroup to use for the container. */
  Cgroup?: string;
  /** @description A list of links for the container in the form `container_name:alias`. */
  Links?: string[];
  /**
   * @description An integer value containing the score given to the container in
   * order to tune OOM killer preferences.
   *
   * @example 500
   */
  OomScoreAdj?: number;
  /**
   * @description Set the PID (Process) Namespace mode for the container. It can be
   * either:
   *
   * - `"container:<name|id>"`: joins another container's PID namespace
   * - `"host"`: use the host's PID namespace inside the container
   */
  PidMode?: string;
  /** @description Gives the container full access to the host. */
  Privileged?: boolean;
  /**
   * @description Allocates an ephemeral host port for all of a container's
   * exposed ports.
   *
   * Ports are de-allocated when the container stops and allocated when
   * the container starts. The allocated port might be changed when
   * restarting the container.
   *
   * The port is selected from the ephemeral port range that depends on
   * the kernel. For example, on Linux the range is defined by
   * `/proc/sys/net/ipv4/ip_local_port_range`.
   */
  PublishAllPorts?: boolean;
  /** @description Mount the container's root filesystem as read only. */
  ReadonlyRootfs?: boolean;
  /**
   * @description A list of string values to customize labels for MLS systems, such
   * as SELinux.
   */
  SecurityOpt?: string[];
  /** @description Storage driver options for this container, in the form `{"size": "120G"}`. */
  StorageOpt?: { [key: string]: string };
  /**
   * @description A map of container directories which should be replaced by tmpfs
   * mounts, and their corresponding mount options. For example:
   *
   * ```
   * { "/run": "rw,noexec,nosuid,size=65536k" }
   * ```
   */
  Tmpfs?: { [key: string]: string };
  /** @description UTS namespace to use for the container. */
  UTSMode?: string;
  /**
   * @description Sets the usernamespace mode for the container when usernamespace
   * remapping option is enabled.
   */
  UsernsMode?: string;
  /** @description Size of `/dev/shm` in bytes. If omitted, the system uses 64MB. */
  ShmSize?: number;
  /**
   * @description A list of kernel parameters (sysctls) to set in the container.
   * For example:
   *
   * ```
   * {"net.ipv4.ip_forward": "1"}
   * ```
   */
  Sysctls?: { [key: string]: string };
  /** @description Runtime to use with this container. */
  Runtime?: string;
  /** @description Initial console size, as an `[height, width]` array. (Windows only) */
  ConsoleSize?: number[];
  /**
   * @description Isolation technology of the container. (Windows only)
   *
   * @enum {string}
   */
  Isolation?: "default" | "process" | "hyperv";
  /**
   * @description The list of paths to be masked inside the container (this overrides
   * the default set of paths).
   */
  MaskedPaths?: string[];
  /**
   * @description The list of paths to be set as read-only inside the container
   * (this overrides the default set of paths).
   */
  ReadonlyPaths?: string[];
}

export interface ContainerInspectResponse {
  /** @description The ID of the container */
  Id?: string;
  /** @description The time the container was created */
  Created?: string;
  /** @description The path to the command being run */
  Path?: string;
  /** @description The arguments to the command being run */
  Args?: string[];
  State?: ContainerState;
  /** @description The container's image ID */
  Image?: string;
  ResolvConfPath?: string;
  HostnamePath?: string;
  HostsPath?: string;
  LogPath?: string;
  Name?: string;
  RestartCount?: number;
  Driver?: string;
  Platform?: string;
  MountLabel?: string;
  ProcessLabel?: string;
  AppArmorProfile?: string;
  /** @description IDs of exec instances that are running in the container. */
  ExecIDs?: string[];
  HostConfig?: HostConfig;
  GraphDriver?: GraphDriverData;
  /**
   * Format: int64
   * @description The size of files that have been created or changed by this
   * container.
   */
  SizeRw?: number;
  /**
   * Format: int64
   * @description The total size of all the files in this container.
   */
  SizeRootFs?: number;
  Mounts?: MountPoint[];
  Config?: ContainerConfig;
  NetworkSettings?: NetworkSettings;
}

interface ContainerTopParams {
  /** ID or name of the container */
  id: string;
  /** The arguments to pass to `ps`. For example, `aux` */
  ps_args?: string;
}

interface ContainerTopResponse {
  /** @description The ps column titles */
  Titles?: string[];
  /**
   * @description Each process running in the container, where each is process
   * is an array of values corresponding to the titles.
   */
  Processes?: string[][];
}

interface ContainerLogsParams {
  /** ID or name of the container */
  id: string;
  /** Keep connection after returning logs. */
  follow?: boolean;
  /** Return logs from `stdout` */
  stdout?: boolean;
  /** Return logs from `stderr` */
  stderr?: boolean;
  /** Only return logs since this time, as a UNIX timestamp */
  since?: number;
  /** Only return logs before this time, as a UNIX timestamp */
  until?: number;
  /** Add timestamps to every log line */
  timestamps?: boolean;
  /**
   * Only return this number of log lines from the end of the logs.
   * Specify as an integer or `all` to output all log lines.
   */
  tail?: string;
}

interface ContainerLogsResponse {
  /**
   * logs returned as a stream in response body.
   * For the stream format, [see the documentation for the attach endpoint](#operation/ContainerAttach).
   * Note that unlike the attach endpoint, the logs endpoint does not
   * upgrade the connection and does not set Content-Type.
   */
  schema: string;
}

interface ContainerStartParams {
  /** ID or name of the container */
  id: string;
  /**
   * Override the key sequence for detaching a container. Format is a
   * single character `[a-Z]` or `ctrl-<value>` where `<value>` is one
   * of: `a-z`, `@`, `^`, `[`, `,` or `_`.
   */
  detachKeys?: string;
}
interface ContainerStartResponse {
  done: boolean;
  error?: ErrorResponse;
}

interface ContainerStopParams {
  /** ID or name of the container */
  id: string;
  /** Number of seconds to wait before killing the container */
  t?: number;
}
interface ContainerStopResponse {
  done: boolean;
  error?: ErrorResponse;
}

interface ContainerRestartParams {
  /** ID or name of the container */
  id: string;
  /** Number of seconds to wait before killing the container */
  t?: number;
}
interface ContainerRestartResponse {
  done: boolean;
  error?: ErrorResponse;
}

interface ContainerKillParams {
  /** ID or name of the container */
  id: string;
  /** Signal to send to the container as an integer or string (e.g. `SIGINT`) */
  signal?: string;
}
interface ContainerKillResponse {
  done: boolean;
  error?: ErrorResponse;
}

interface ContainerUpdateParams {
  /** ID or name of the container */
  id: string;
  data: Resources & {
    RestartPolicy?: RestartPolicy;
  };
}
interface ContainerUpdateResponse {
  schema: {
    Warnings?: string[];
  };
}

interface ContainerDeleteParams {
  /** ID or name of the container */
  id: string;
  /** Remove anonymous volumes associated with the container. */
  v?: boolean;
  /** If the container is running, kill it before removing it. */
  force?: boolean;
  /** Remove the specified link associated with the container. */
  link?: boolean;
}
interface ContainerDeleteResponse {
  done: boolean;
  error?: ErrorResponse;
}
