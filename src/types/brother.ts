
export type Brother = {
  id: string;
  name: string;
  email: string;
  degree: string;
  profession: string;
  birth_date: string;
  phone: string;
  higher_degree?: number;
};

export type CriticalOverdueBrother = {
  id: string;
  name: string;
  overdueCount: number;
  latestDueDate: string;
};
