export interface IPokemon {
  count: number;
  next: string;
  previous: string;
  results: IPokemonResults[];
}

export interface IPokemonResults {
  name: string;
  url: string;
}

export interface IPokemonById {
  name: string;
  types: TypeElement[];
}

export interface TypeElement {
  slot: number;
  type: TypeInfo;
}

export interface TypeInfo {
  name: string;
  url: string;
}
