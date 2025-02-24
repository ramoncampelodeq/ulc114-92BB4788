
import { Brother } from "./brother";

export type PaymentStatus = "pending" | "paid" | "overdue";

export type Payment = {
  id: string;
  brotherId: string;
  brother: Brother;
  month: number;
  year: number;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentFormData = {
  brotherId: string;
  month: number;
  year: number;
  amount: number;
  isPaid: boolean;
  paidAt?: string;
};

export type OverduePayment = {
  brotherId: string;
  brotherName: string;
  overdueMonths: string[];
  totalOverdue: number;
};

export type CriticalOverdueReport = {
  brothers: {
    id: string;
    name: string;
    overdueCount: number;
    latestDueDate: string;
  }[];
  totalBrothers: number;
  overduePercentage: number;
};
