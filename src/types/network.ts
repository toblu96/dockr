declare interface Address {
  Addr: string;
  PrefixLen: number;
}

declare interface IPAM {
  Driver: string;
  Options: { [key: string]: string };
  Config: IPAMConfig[];
}

declare interface IPAMConfig {
  Subnet?: string;
  IPRange?: string;
  Gateway?: string;
  AuxiliaryAddresses?: { [key: string]: string };
}

declare interface EndpointIPAMConfig {
  IPv4Address?: string;
  IPv6Address?: string;
  LinkLocalIPs?: string[];
}

declare interface PeerInfo {
  Name: string;
  IP: string;
}

declare interface EndpointSettings {
  IPAMConfig?: EndpointIPAMConfig;
  Links: string[];
  Aliases: string[];
  NetworkID: string;
  EndpointID: string;
  Gateway: string;
  IPAddress: string;
  IPPrefixLen: number;
  IPv6Gateway: string;
  GlobalIPv6Address: string;
  GlobalIPv6PrefixLen: number;
  MacAddress: string;
  DriverOpts: { [key: string]: string };
}

declare interface Task {
  Name: string;
  EndpointID: string;
  EndpointIP: string;
  Info: { [key: string]: string };
}

declare interface ServiceInfo {
  VIP: string;
  Ports: string[];
  LocalLBIndex: number;
  Tasks: Task[];
}

declare interface NetworkingConfig {
  EndpointsConfig: { [key: string]: EndpointSettings | undefined };
}

declare interface ConfigReference {
  Network: string;
}
