import type { Scores } from "./criteria";

export type Boy = {
  id: string;
  name: string;
  locked: boolean;
  scores: Scores;
  total: number;
  createdAt: string;
};
