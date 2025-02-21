
import { Brother } from "./brother";
import { Session } from "./session";

export type Attendance = {
  id: string;
  sessionId: string;
  brotherId: string;
  present: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AttendanceRecord = {
  brother: Brother;
  totalSessions: number;
  attendedSessions: number;
  participationPercentage: number;
  lastAttendance?: string;
};

export type SessionAttendance = {
  session: Session;
  attendance: Attendance[];
  totalPresent: number;
};
