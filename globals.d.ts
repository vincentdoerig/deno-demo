export interface Dinosaur {
  id?: string;
  name: string;
  image: string;
}

export interface RequestError extends Error {
  status: number;
}
