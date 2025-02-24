
import { Brother } from "./brother";

export type PaymentStatus = "pending" | "paid" | "overdue";

export type Payment = {
  id: string;
  brotherId: string;
  brother?: Brother;
  month: number;
  year: number;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentRecord = {
  brother: Brother;
  payments: Payment[];
  overdueCount: number;
  lastPayment?: Payment;
};

export type MonthlyPayment = {
  month: number;
  year: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
};
