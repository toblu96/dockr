export interface Address {
  Addr: string;
  PrefixLen: number;
}

export interface IPAM {
  Driver: string;
  Options: { [key: string]: string };
  Config: IPAMConfig[];
}

export interface IPAMConfig {
  Subnet?: string;
  IPRange?: string;
  Gateway?: string;
  AuxiliaryAddresses?: { [key: string]: string };
}

export interface EndpointIPAMConfig {
  IPv4Address?: string;
  IPv6Address?: string;
  LinkLocalIPs?: string[];
}

export interface PeerInfo {
  Name: string;
  IP: string;
}

export interface EndpointSettings {
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

export interface Task {
  Name: string;
  EndpointID: string;
  EndpointIP: string;
  Info: { [key: string]: string };
}

export interface ServiceInfo {
  VIP: string;
  Ports: string[];
  LocalLBIndex: number;
  Tasks: Task[];
}

export interface NetworkingConfig {
  EndpointsConfig: { [key: string]: EndpointSettings | undefined };
}

export interface ConfigReference {
  Network: string;
}
