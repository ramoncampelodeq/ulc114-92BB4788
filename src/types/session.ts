
export type SessionFormData = {
  date: string;
  time: string;
  degree: "Apprentice" | "Fellow Craft" | "Master Mason";
  topic: string;
  agenda: string;
  minutes: string;
  balaustreUrl?: string;
};

export type Session = {
  id: string;
  date: string;
  time: string;
  degree: "Apprentice" | "Fellow Craft" | "Master Mason";
  topic: string;
  agenda: string;
  minutes: string;
  balaustreUrl?: string;
  createdAt: string;
  updatedAt: string;
};
