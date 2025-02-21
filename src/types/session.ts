
import { MasonicDegree } from "./brother";

export type Session = {
  id: string;
  date: string;
  time: string;
  degree: MasonicDegree;
  agenda: string;
  balaustreUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type SessionFormData = Omit<Session, "id" | "createdAt" | "updatedAt" | "balaustreUrl">;
