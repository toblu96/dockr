export interface ContainerListOptions {
  Size: boolean;
  All: boolean;
  Limit: number;
  Filters: ContainerListOptionsFilter;
}

export interface ContainerListOptionsFilter {
  status: string[];
}
