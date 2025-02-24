
export type CashMovementType = "income" | "expense";

export type CashMovementCategory = "monthly_fee" | "solidarity_trunk" | "other_income" | "expense";

export type CashMovement = {
  id: string;
  createdAt: string;
  userId: string;
  type: CashMovementType;
  category: CashMovementCategory;
  amount: number;
  description?: string;
  month: number;
  year: number;
};

export type CashBalance = {
  month: number;
  year: number;
  monthlyFeesTotal: number;
  solidarityTrunkTotal: number;
  otherIncomeTotal: number;
  expensesTotal: number;
  totalBalance: number;
};
