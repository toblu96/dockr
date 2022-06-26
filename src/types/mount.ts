export namespace mount {
  export enum Type {
    bind,
    volume,
    tmpfs,
    npipe,
  }

  export enum Propagation {
    rprivate,
    private,
    rshared,
    shared,
    rslave,
    slave,
  }
}
