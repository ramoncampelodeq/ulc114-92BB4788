
export type PaymentFormData = {
  brotherId: string;
  months: number[];
  year: number;
  amount: number;
  status: "pending" | "paid";
  paidAt?: string;
};

export type Month = {
  value: number;
  label: string;
};
