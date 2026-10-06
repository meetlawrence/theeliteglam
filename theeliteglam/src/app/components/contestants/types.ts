export type Gender = "female" | "male";

export interface Contestant {
  id: number;
  databaseId: string;
  name: string;
  stageName: string;
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
