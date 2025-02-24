
export type MasonicDegree = "Apprentice" | "Fellow Craft" | "Master Mason";

export type HigherDegree = {
  id: number;
  name: string;
  date: string;
};

export type Relative = {
  id: string;
  name: string;
  relationship: string;
  birthDate: string;
};

export type Brother = {
  id: string;
  name: string;
  email: string;
  degree: string;
  profession: string;
  birth_date: string;
  phone: string;
  higher_degree?: number;
  dateInitiated?: string;
  relatives?: Relative[];
};

export type CriticalOverdueBrother = {
  id: string;
  name: string;
  overdueCount: number;
  latestDueDate: string;
};

export type BrotherFormData = {
  name: string;
  email: string;
  phone: string;
  profession: string;
  degree: MasonicDegree;
  birthDate: string;
  dateInitiated: string;
};
