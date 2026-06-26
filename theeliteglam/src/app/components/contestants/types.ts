export type Gender = "female" | "male";

export interface Contestant {
  id: number;
  name: string;
  state: string;
  age: number;
  gender: Gender;
  number: string;
  bio: string;
  image: string;
  votes: number;
  occupation: string;
  advocacy: string;
  funFact: string;
  tribe: string;
}
