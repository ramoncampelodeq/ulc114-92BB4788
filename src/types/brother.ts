
export type MasonicDegree = "Apprentice" | "Fellow Craft" | "Master Mason";

export type HigherDegree = {
  degree: number;
  dateReceived: string;
  location: string;
};

export type Relative = {
  id: string;
  name: string;
  birthDate: string;
  relationship: string;
};

export type Brother = {
  id: string;
  name: string;
  profession: string;
  degree: MasonicDegree;
  birth_date: string; // Changed from birthDate to birth_date to match DB
  dateInitiated: string;
  email: string;
  phone: string;
  higherDegrees: HigherDegree[];
  relatives: Relative[];
  createdAt: string;
  updatedAt: string;
};

export type BrotherFormData = Omit<Brother, "id" | "createdAt" | "updatedAt">;
