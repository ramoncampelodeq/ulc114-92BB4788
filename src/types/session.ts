
export type SessionFormData = {
  date: string;
  time: string;
  degree: "aprendiz" | "companheiro" | "mestre";
  type: "ordinaria" | "administrativa" | "branca" | "magna";
  agenda: string;
  minutes_url?: string;
};

export type Session = {
  id: string;
  date: string;
  time: string;
  degree: "aprendiz" | "companheiro" | "mestre";
  type: "ordinaria" | "administrativa" | "branca" | "magna";
  agenda: string;
  minutes_url?: string;
  created_at: string;
  user_id?: string;
};
